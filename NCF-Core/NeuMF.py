import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import regularizers


class NeuMF(keras.Model):
    def __init__(self, num_users, num_items, mf_dim, layers, reg_layers, reg_mf):
        super(NeuMF, self).__init__()
        self.MF_Embedding_User = keras.layers.Embedding(
            input_dim=num_users,  # 用户数
            output_dim=mf_dim,  # 嵌入维度8
            name='mf_embedding_user',  # MF中的用户嵌入层name
            embeddings_initializer='random_uniform',  # 均匀分布初始化
            embeddings_regularizer=regularizers.l2(reg_mf),  # l2正则化
        )
        self.MF_Embedding_Item = keras.layers.Embedding(
            input_dim=num_items,  # 电影数
            output_dim=mf_dim,  # 嵌入维度 8
            name='mf_embedding_item',  # MF中的项目嵌入层name
            embeddings_initializer='random_uniform',  # 均匀分布随机初始化
            embeddings_regularizer=regularizers.l2(reg_mf),  # l2正则化
        )
        self.MLP_Embedding_User = keras.layers.Embedding(
            input_dim=num_users,
            output_dim=int(layers[0] / 2),  # MLP嵌入层维度64/2 = 32
            name='mlp_embedding_user',  # MLP中的用户嵌入层
            embeddings_initializer='random_uniform',
            embeddings_regularizer=regularizers.l2(reg_layers[0]),
        )
        self.MLP_Embedding_Item = keras.layers.Embedding(
            input_dim=num_items,
            output_dim=int(layers[0] / 2),  # MLP输入层维度 64/2 = 32
            name='mlp_embedding_item',  # MLP中的用户嵌入层名称
            embeddings_initializer='random_uniform',
            embeddings_regularizer=regularizers.l2(reg_layers[0]),
        )
        self.flatten = keras.layers.Flatten()  #
        self.mf_vector = keras.layers.Multiply()  # GMF层为用户向量和项目向量点积。
        self.mlp_vector = keras.layers.Concatenate(axis=-1)
        self.layer1 = keras.layers.Dense(
            layers[1],  # 第一层输出维度32
            name='layer1',
            activation='relu',
            kernel_regularizer=regularizers.l2(reg_layers[1]),
        )
        self.layer2 = keras.layers.Dense(
            layers[2],  # 第二层输出维度16
            name='layer2',
            activation='relu',
            kernel_regularizer=regularizers.l2(reg_layers[2]),
        )
        self.layer3 = keras.layers.Dense(
            layers[3],  # 第三层输出维度8
            name='layer3',
            activation='relu',
            kernel_regularizer=regularizers.l2(reg_layers[3]),
        )
        self.predict_vector = keras.layers.Concatenate(axis=-1)
        self.layer4 = keras.layers.Dense(
            1,  # 最好一层，即NeuMF层的输出维度为1
            activation='sigmoid',
            kernel_initializer='lecun_uniform',
            name='prediction'
        )

    @tf.function
    def call(self, inputs):
        # Embedding，四个嵌入层，输入皆为一个ID，然后转换为到对应维度的嵌入向量
        MF_Embedding_User = self.MF_Embedding_User(inputs[0])  # (1,8)
        MF_Embedding_Item = self.MF_Embedding_Item(inputs[1])  # 1
        MLP_Embedding_User = self.MLP_Embedding_User(inputs[0])  # (1,32)
        MLP_Embedding_Item = self.MLP_Embedding_Item(inputs[1])  # 1

        # MF MF层输出为用户电影逐一相乘
        mf_user_latent = self.flatten(MF_Embedding_User)  # (1,8)
        mf_item_latent = self.flatten(MF_Embedding_Item)
        mf_vector = self.mf_vector([mf_user_latent, mf_item_latent])  # (1,1)

        # MLP
        mlp_user_latent = self.flatten(MLP_Embedding_User)  # (1,32)
        mlp_item_latent = self.flatten(MLP_Embedding_Item)
        mlp_vector = self.mlp_vector([mlp_user_latent, mlp_item_latent])  # 两个向量concatenate为一个长向量 (1,64)
        mlp_vector = self.layer1(mlp_vector)
        mlp_vector = self.layer2(mlp_vector)
        mlp_vector = self.layer3(mlp_vector)  # 第三层的输出维度为8

        # NeuMF
        vector = self.predict_vector([mf_vector, mlp_vector])  # MF层输出和MLP层输出合并得到NeuMF的输入 (1,9)
        output = self.layer4(vector)  # 输出维度(1,1)，[0,1]

        return output
