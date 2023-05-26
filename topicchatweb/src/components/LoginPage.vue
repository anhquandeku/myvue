<template>
    <section class="h-screen">
        <div class="h-full">
            <div class="row justify-content-center">
                <div class="col-4">
                    <img src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        class="img-fluid" alt="Sample image" />
                    <div class="alert alert-light-danger color-danger fade" id="message">
                        Wrong user name or password
                    </div>
                    <form>
                        <div class="form-outline mb-4">
                            <input type="text" class="form-control" placeholder="Username" id="username" required />
                        </div>
                        <div class="form-outline mb-4">
                            <input type="password" class="form-control" placeholder="Password" id="password"
                                @keyup.enter="login()" required />
                        </div>
                        <div class="text-center">
                            <button type="button" class="btn btn-primary btn-block btn-lg mb-4" @click="login()">
                                Login
                            </button>
                            <p>Don't have an account? <a type="button" class="color-primary" data-bs-toggle="modal"
                                    data-bs-target="#signupform">Sign up</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    <!-- Modal sign up -->
    <div class="modal fade text-left" id="signupform" tabindex="-1" role="dialog" aria-labelledby="myModalLabel33"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel33">Sign up </h4>
                </div>
                <form>
                    <div class="modal-body">
                        <label>Username: </label>
                        <div class="form-group">
                            <input type="text" placeholder="Your username" class="form-control" id="sign-username">
                        </div>
                        <label>Password: </label>
                        <div class="form-group">
                            <input type="password" placeholder="Your password" class="form-control" id="sign-password">
                        </div>

                        <label>Display name: </label>
                        <div class="form-group">
                            <input type="text" placeholder="Your display name" class="form-control" id="sign-displayname">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">Close
                        </button>
                        <button type="button" class="btn btn-primary ml-1" data-bs-dismiss="modal" @click="singup()">Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import router from "@/router";
import { ref, reactive } from "vue";
export default {
    setup() {
        if (localStorage.getItem('sessionData') != null) {
            router.push("/");
        }
    },
    methods: {
        login: function () {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const showMessage = document.querySelector("#message");
            const isuser = document.querySelector("#username");
            const ispword = document.querySelector("#password");
            const error = ref(null);
            const sessionData = reactive({
                id: null,
                displayName: null,
                // token: null
            })
            const requestOptions = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userName: username,
                    password: password,
                }),
            };
            fetch("https://localhost:7033/api/v1/auth/login", requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        showMessage.classList.add('show');
                        isuser.classList.add('is-invalid');
                        ispword.classList.add('is-invalid');
                        const error = new Error(response);
                        error.json = response.json();
                        throw error;
                    }
                    return response.json();
                })
                .then((data) => {
                    sessionData.id = data.id;
                    sessionData.displayName = data.displayName;
                    localStorage.setItem('sessionData', JSON.stringify(sessionData));
                    this.$router.push("/");
                })
                .catch((err) => {
                    error.value = err;
                    if (err.json) {
                        return err.json.then((json) => {
                            error.value.message = json.message;
                        });
                    }
                });
        },
        singup: function () {
            const username = document.getElementById("sign-username").value;
            const password = document.getElementById("sign-password").value;
            const displayName = document.getElementById("sign-displayname").value;
            const error = ref(null);
            const sessionData = reactive({
                id: null,
                displayName: null
                // token: null
            })
            const requestOptions = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userName: username,
                    password: password,
                    displayName: displayName
                }),
            };
            fetch("https://localhost:7033/api/v1/auth/register", requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        const error = new Error(response);
                        error.json = response.json();
                        throw error;
                    }
                    return response.json();
                })
                .then((data) => {
                    sessionData.id = data.id;
                    sessionData.displayName = data.displayName;
                    localStorage.setItem('sessionData', JSON.stringify(sessionData));
                    this.$router.push("/");
                })
                .catch((err) => {
                    error.value = err;
                    if (err.json) {
                        return err.json.then((json) => {
                            error.value.message = json.message;
                        });
                    }
                });
        }

    },
};
</script>
