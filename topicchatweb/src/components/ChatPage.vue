<template>
  <div id="sidebar" class='active'>
    <div class="sidebar-wrapper">
      <div class="sidebar-menu">
        <ul class="menu mt-0">
          <li class='sidebar-title'>
            <router-link to="/">Home</router-link>
          </li>
          <li class="sidebar-item " v-for="post of data" :key="post.id">
            <a class='sidebar-link' v-if="post.isSubcribed">
              <span  @click="changetopic(post.id, post.name)">{{ post.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div id="main">
    <div class="main-content container-fluid pt-0 pb-0">
      <section class="section">
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-0 vh-100">
              <nav class="navbar navbar-header navbar-expand navbar-light">
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav d-flex align-items-center navbar-light ms-auto">
                    <li class="dropdown">
                      <a href="#" data-bs-toggle="dropdown" class="nav-link dropdown-toggle nav-link-lg nav-link-user">
                        <div class="avatar me-1">
                          <img src="../assets/logo.png">
                        </div>
                        <div class="d-none d-md-block d-lg-inline-block">Hi, {{ displayName }}</div>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item">Account</a>
                        <div class="dropdown-divider"></div>
                        <div type="button" class="dropdown-item" @click="logout()"> Logout</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </nav>
              <div class="card-header">
                <div class="media d-flex align-items-center">
                  <div class="avatar me-3">
                    <img src="../assets/logo.png" alt="" srcset="">
                    <span class="avatar-status bg-success"></span>
                  </div>
                  <div class="name flex-grow-1">
                    <h6 class='mb-0'>{{ topicName }}</h6>
                    <span class='text-xs'>Online</span>
                  </div>
                  <button class='btn btn-sm'>
                    <i data-feather="x"></i>
                  </button>
                </div>
              </div>
              <div class="card-body pt-4 bg-grey block overflow-auto">
                <div v-for="mess of messages" :key="mess.messageId">
                  <div v-if="mess.senderId == id">
                    <div class="d-flex flex-row justify-content-end">
                      <div>
                        <p class="ms-3 mb-1 rounded-3 text-end">{{ mess.senderName }}</p>
                        <p class="p-2 ms-3 mb-1 text-white rounded-3 bg-primary text-end">{{ mess.content }}</p>
                        <p class="small ms-3 mb-3 rounded-3 text-muted text-end">{{ mess.createTime }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="d-flex flex-row justify-content-start">
                      <div>
                        <p class="ms-3 mb-1 rounded-3">{{ mess.senderName }}</p>
                        <p class="p-2 ms-3 mb-1 rounded-3 bg-white">{{ mess.content }}</p>
                        <p class="small ms-3 mb-3 rounded-3 text-muted">{{ mess.createTime }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer pb-2">
                <div class="message-form d-flex flex-direction-column align-items-center">
                  <div class="d-flex flex-grow-1 ml-4">
                    <input type="text" class="form-control" @keyup.enter="send()" id="send-message" placeholder="Type your message.." required>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import router from "@/router";
import { ref, onMounted} from "vue";
export default {
  setup() {
    var displayName = ref(null);
    var id = ref(null);
    var topicName = ref(null);
    var topicId = 0;
    if(localStorage.getItem('sessionData')==null){
      router.push("/login");
    }else{
      displayName = JSON.parse(localStorage.getItem('sessionData')).displayName;
      id = JSON.parse(localStorage.getItem('sessionData')).id;
      topicName = localStorage.getItem('sessionTopicName');
      topicId = localStorage.getItem("sessionTopicId");
    }
    var data =[];
    const loading = ref(true);
    const error = ref(null);
    const messages = ref(null);

    function fetchData() {
      loading.value = true;
      fetch("https://localhost:7033/api/v1/topic?clientid=" + JSON.parse(localStorage.getItem('sessionData')).id, {
        mode: "cors",
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            const error = new Error(res.statusText);
            error.json = res.json();
            throw error;
          }
          return res.json();
        })
        .then((json) => {
          for(var i=0; i<json.length;i++){
            data.push(json[i]);
          }
        })
        .catch((err) => {
          error.value = err;
          if (err.json) {
            return err.json.then((json) => {
              error.value.message = json.message;
            });
          }
        })
        .then(() => {
          loading.value = false;
        })
        return data
    }

    function fetchMessage() {
      loading.value = true;
      fetch("https://localhost:7033/api/v1/topic/" + topicId+ "/message", {
        mode: "cors",
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            const error = new Error(res.statusText);
            error.json = res.json();
            throw error;
          }
          return res.json();
        })
        .then((json) => {
          messages.value=json
        })
        .catch((err) => {
          error.value = err;
          if (err.json) {
            return err.json.then((json) => {
              error.value.message = json.message;
            });
          }
        })
        .then(() => {
          loading.value = false;
        })
        return messages
    }

    onMounted(() => {
      fetchData();
      fetchMessage();
    });
    return {
    id,
      data,
      messages,
      loading,
      error,
      displayName,
      topicName,
      topicId
    };
  },
  methods:{
    logout:function(){
      localStorage.removeItem('sessionData');
      router.push('/login');
    },
    send: function(){
      if(document.getElementById("send-message").value!=''){
      const requestOptions = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          senderId: JSON.parse(localStorage.getItem('sessionData')).id,
          content: document.getElementById("send-message").value
        }),
      };
      fetch("https://localhost:7033/api/v1/topic/" + localStorage.getItem("sessionTopicId") + "/send-message", requestOptions)
        .then((response) => {
          if (!response.ok) {
            const error = new Error(response);
            error.json = response.json();
            throw error;
          }
          location.reload();
          return response.json();
        })
      }
    },
    changetopic: function(topicid, topicname){
      localStorage.setItem('sessionTopicId', topicid);
      localStorage.setItem('sessionTopicName', topicname);
      location.reload();
    }
  }
};
</script>