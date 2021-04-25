package com.yxf.demo.util;

public class GenericResult<T> {
    private T data;
    private String restCode = "";
    private String errorCode = "";
    private Boolean success = true;

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getRestCode() {
        return restCode;
    }

    public void setRestCode(String restCode) {
        this.restCode = restCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }
}
