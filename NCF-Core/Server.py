import argparse
import heapq
from time import time

import numpy as np
from flask import Flask, jsonify
from flask_apscheduler import APScheduler
from tensorflow.keras import optimizers
from Dataset import Dataset
from NeuMF import NeuMF

app = Flask(__name__)
scheduler = APScheduler(5)


def parse_args():
    parser = argparse.ArgumentParser(description="Run NeuMF.")
    parser.add_argument('--path', nargs='?', default='Data/',
                        help='Input data path.')
    parser.add_argument('--dataset', nargs='?', default='ml-1m',
                        help='Choose a dataset.')
    parser.add_argument('--epochs', type=int, default=20,
                        help='Number of epochs.')
    parser.add_argument('--batch_size', type=int, default=256,
                        help='Batch size.')
    parser.add_argument('--num_factors', type=int, default=8,
                        help='Embedding size of MF model.')
    parser.add_argument('--layers', nargs='?', default='[64,32,16,8]',
                        help="MLP layers. Note that the first layer is the concatenation of user and item embeddings. So layers[0]/2 is the embedding size.")
    parser.add_argument('--reg_mf', type=float, default=0,
                        help='Regularization for MF embeddings.')
    parser.add_argument('--reg_layers', nargs='?', default='[0,0,0,0]',
                        help="Regularization for each MLP layer. reg_layers[0] is the regularization for embeddings.")
    parser.add_argument('--num_neg', type=int, default=4,
                        help='Number of negative instances to pair with a positive instance.')
    parser.add_argument('--lr', type=float, default=0.001,
                        help='Learning rate.')
    parser.add_argument('--learner', nargs='?', default='adam',
                        help='Specify an optimizer: adagrad, adam, rmsprop, sgd')
    parser.add_argument('--verbose', type=int, default=1,
                        help='Show performance per X iterations')
    parser.add_argument('--out', type=int, default=1,
                        help='Whether to save the trained model.')
    parser.add_argument('--mf_pretrain', nargs='?', default='',
                        help='Specify the pretrain model file for MF part. If empty, no pretrain will be used')
    parser.add_argument('--mlp_pretrain', nargs='?', default='',
                        help='Specify the pretrain model file for MLP part. If empty, no pretrain will be used')
    return parser.parse_args()


args = parse_args()
num_epochs = args.epochs
batch_size = args.batch_size
mf_dim = args.num_factors
layers = eval(args.layers)
reg_mf = args.reg_mf
reg_layers = eval(args.reg_layers)
num_negatives = args.num_neg
learning_rate = args.lr
learner = args.learner
verbose = args.verbose
mf_pretrain = args.mf_pretrain
mlp_pretrain = args.mlp_pretrain
dataset = Dataset(args.path + args.dataset)
trainer = dataset.trainMatrix
testRatings = dataset.testRatings
testNegatives = dataset.testNegatives
num_users, num_items = trainer.shape
model = object


def get_train_instances(train, num_negatives, num_items):
    user_input, item_input, labels = [], [], []
    num_users = train.shape[0]
    for (u, i) in train.keys():
        # positive instance
        user_input.append(u)
        item_input.append(i)
        labels.append(1)
        # negative instances
        for t in range(num_negatives):
            j = np.random.randint(num_items)
            while train.__contains__((u, j)):
                j = np.random.randint(num_items)
            user_input.append(u)
            item_input.append(j)
            labels.append(0)
    return user_input, item_input, labels


def predictTopN(model, id, testNegatives, topN):
    u = id  # 获取user
    items = testNegatives[0]  # 获取item列表
    gtItem = testRatings[id][1]
    items.append(gtItem)
    user0 = np.full(len(items), u, dtype='int32')  # 将user扩展为与item等长的矩阵
    map_item_score = {}  # 得分列表
    print(user0)
    print(items)
    # 进行评分
    predictions = model.predict([user0, np.array(items)], batch_size=100, verbose=0)
    for i in range(len(items)):
        item = items[i]
        map_item_score[item] = predictions[i]  # 将评分放入分数列表对应位置
    items.pop()
    # 获取分数列表topN
    ranklist = heapq.nlargest(topN, map_item_score, key=map_item_score.get)
    print(ranklist)
    return ranklist


def NcfTraining():
    global num_epochs, batch_size, mf_dim, layers, reg_mf, reg_layers, num_negatives, learning_rate, learner, verbose, mf_pretrain, mlp_pretrain

    topK = 10
    print(f"NeuMF arguments: {args} ")
    model_out_file = 'Pretrain/%s_NeuMF_%d_%s_%d.h5' % (args.dataset, mf_dim, args.layers, time())

    t1 = time()
    global trainer, testRatings, testNegatives, num_users, num_items
    print("Load data done [%.1f s]. #user=%d, #item=%d,  #test=%d"
          % (time() - t1, num_users, num_items, len(testRatings)))

    global model
    model = NeuMF(num_users, num_items, mf_dim, layers, reg_layers, reg_mf)
    model.build(input_shape=[1, 1])  # 建立模型，并指明输入的维度及其形状
    model.compile(optimizer=optimizers.Adam(lr=learning_rate), loss='binary_crossentropy')  # 用于使用损失函数，优化，损失指标，损失重量等配置模型

    # 1. 输入userID,输入电影ID，标签。正样本 + 4个负样本
    user_input, item_input, labels = get_train_instances(trainer, num_negatives, num_items)
    # model.fit(X,y)
    time00 = time()
    for i in range(num_epochs):
        t1 = time()
        hist = model.fit([np.array(user_input), np.array(item_input)],
                         np.array(labels),
                         batch_size=batch_size,
                         epochs=1,
                         verbose=1,
                         shuffle=True)
        print('Iteration %d [%.1f s]' % (i, time() - t1))
    # 到达某些条件，保存模型
    model.save_weights(model_out_file, overwrite=True)
    print("use time %.1f s" % (time() - time00))


# 开始进行训练
@app.route('/train/')
def train():
    # scheduler.add_job(func=NcfTraining(), id='train', trigger='cron', minutes=40)
    # scheduler.start()
    NcfTraining()
    return "start training"


# 接收 GET 请求，返回predict数组
@app.route('/predict/<int:id>')
def predict(id):
    global model, testRatings, testNegatives
    info = dict()
    info['id'] = id
    try:
        info['list'] = predictTopN(model, id, testNegatives, 10)
        info['success'] = True
    except Exception as e:
        print(e)
        info['success'] = False
    return jsonify(info)


NcfTraining()

if __name__ == '__main__':
    app.run(host="localhost", debug=False)
