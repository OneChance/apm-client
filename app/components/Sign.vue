<template id="login">
    <div>
        <div class="bg"></div>
        <el-card class="box-card login-card">
            <div slot="header" class="clearfix header">
                    <span class="sign-title">
                        <p style="margin: 5px 0;font-family: fangsong,serif;">扬州大学</p>
                        <p style="margin: 0;">工程审计管理信息系统</p>
                    </span>
            </div>
            <el-form :model=" form">
                <el-form-item>
                    <el-input v-model="name" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" v-model="password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" class="sign-btn sign-local-btn" @click="signIn" disabled="disabled">
                        登陆
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" class="sign-btn" @click="authCenter">统一身份认证</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>

import Account from '../script/server/account.js'
import md5 from 'js-md5';

export default {
    data: function () {
        return {
            name: '',
            password: ''
        }
    },
    watch: {
        name: function () {
            this.checkInput();
        },
        password: function () {
            this.checkInput();
        }
    },
    methods: {
        checkInput: function () {
            if (this.password && this.name) {
                $(".sign-local-btn").removeAttr("disabled").removeClass("is-disabled")
            } else {
                $(".sign-local-btn").attr("disabled", "disabled").addClass("is-disabled")
            }
        },
        signIn: function () {
            Account.signIn({
                username: this.name,
                password: md5(this.password)
            }).then(this.signCallback).catch(() => {
            });
        },
        authCenter: function () {
            window.location.href = "https://uaaap.yzu.edu.cn/cas/login?service=http%3a%2f%2fgcsj.yzu.edu.cn/api/third-party/callback/";
        },
        signCallback: function (res) {
            if (res) {
                //保存token
                localStorage.setItem("apm_token", res.token);
                this.$cookie.set('apm_token', res.token);
                this.$router.push('index').catch(err => err)
            }
        },
    },
    mounted: function () {

    },
}
</script>

<style scoped>

.login-card {
    width: 350px;
    position: fixed;
    top: 180px;
    left: calc(50vw - 180px);
}

.sign-title {
    font-size: x-large;
    color: #e1184a;
    font-weight: 700;
}

.header {
    text-align: center;
}

.sign-btn {
    width: 100%;
}

.bg {
    /*background-size: cover;
    background-image: url("./../assets/images/login-bg.jpg");
    opacity: 0.7;*/
    width: 100vw;
    height: 100vh;
    background-color: #f7f3f3;
}

.logo img {
    vertical-align: middle;
    padding-right: 10px;
}

.logo span {
    border-left: 1px solid #b9bfcf;
    padding-left: 10px;
}

.sign-local-btn {
    margin-bottom: 10px;
}
</style>
