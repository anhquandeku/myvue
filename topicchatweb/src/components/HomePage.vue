<template>
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
    <div class="row w-100 justify-content-md-center ms-0 me-0">
    <div class="col-12 p-0">
      <div class="card">
        <div class="card-header">
          <div class="row">
          <div class="col-10">
            <input type="text" v-model="search" placeholder="Search topics..." class="form-control mb-2 w-100" /></div>
          <div class="col-2">
            <button class="btn btn-primary fw-bolder" data-bs-toggle="modal"
                                    data-bs-target="#createtopicform">Create Topic</button>
          </div></div>
        </div>
        <div class="card-content">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th class="text-center">NO.</th>
                  <th class="w-50">TOPIC NAME</th>
                  <th>OWNER NAME</th>
                  <th> </th>
                  <th></th>
                </tr>
              </thead>
              <tbody v-if="!loading && data && data.length">
                <tr class="item-topic" :class="[index % 2 ? 'table-light' : 'table-info']" v-for="post of data" :key="post.id">
                  <td class="text-center">{{ index++ }}</td>
                  <td class="w-50">{{ post.name }}</td>
                  <td>{{ post.ownerName }}</td>
                  <td v-if="post.isSubcribed"><button class="btn btn-outline-success w-75 fw-bolder"
                      @click="join(post.id, post.name)">Join</button></td>
                  <td v-else></td>
                  <td v-if="post.isSubcribed"><button class="btn btn-outline-danger w-75 fw-bolder"
                      @click="unsubscribe(post.id)">Unsubcribe</button>
                  </td>
                  <td v-else><button class="btn btn-outline-primary w-75 fw-bolder"
                      @click="subscribe(post.id)">Subcribe</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal create topic -->
  <div class="modal fade text-left" id="createtopicform" tabindex="-1" role="dialog" aria-labelledby="myModalLabel33"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel33">Create Topic</h4>
                </div>
                <form>
                    <div class="modal-body">
                        <label>Topic name: </label>
                        <div class="form-group">
                            <input type="text" placeholder="Topic name..." class="form-control" id="topicname">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">Close
                        </button>
                        <button type="button" class="btn btn-primary ml-1" data-bs-dismiss="modal" @click="createTopic()">Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import router from "@/router";
import { ref, onMounted} from "vue";
export default {
  setup() {
    var displayName = ref(null);
    if(localStorage.getItem('sessionData')==null){
      router.push("/login");
    }else{
      displayName = JSON.parse(localStorage.getItem('sessionData')).displayName;
    }
    var data =[];
    const loading = ref(true);
    const error = ref(null);
    // let search = "ok";
    const index = 1;

    function fetchData() {
      loading.value = true;
      // var result=[]
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
            // const text = JSON.stringify(json[i]);
            //alert(text);
            // //alert(JSON.parse(String(json[i])));
            // alert(json[i].length);
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
        return data;
        // .filter((topic) =>
        // topic.name.toLowerCase().includes(""))
    }
    onMounted(() => {
        fetchData();
    });
    return {
      index,
      data,
      loading,
      error,
      displayName
    };
  },
  methods:{
    logout:function(){
      localStorage.removeItem('sessionData');
      router.push('/login');
    },
    subscribe: function(topicid){
      const requestOptions = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          clientId: JSON.parse(localStorage.getItem('sessionData')).id,
          topicId: topicid
        }),
      };
      fetch("https://localhost:7033/api/v1/topic/sub", requestOptions)
        .then((response) => {
          if (!response.ok) {
            const error = new Error(response);
            error.json = response.json();
            throw error;
          }
          location.reload();
          return response.json();
        })
    },
    unsubscribe: function(topicid){
      const requestOptions = {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          clientId: JSON.parse(localStorage.getItem('sessionData')).id,
          topicId: topicid
        }),
      };
      fetch("https://localhost:7033/api/v1/topic/unsub", requestOptions)
        .then((response) => {
          if (!response.ok) {
            const error = new Error(response);
            error.json = response.json();
            throw error;
          }
          location.reload();
          return response.json();
        })
    },
    join: function(topicid, topicname){
      localStorage.setItem('sessionTopicId', topicid);
      localStorage.setItem('sessionTopicName', topicname);
      router.push("/chat");
    },
    createTopic: function(){
      const requestOptions = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: document.getElementById("topicname").value,
          ownerId: JSON.parse(localStorage.getItem('sessionData')).id
        }),
      };
      fetch("https://localhost:7033/api/v1/topic", requestOptions)
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
  }
};
</script>
