
const app = new Vue({
    el: "#app",
    data: {
      userData: {
        client_id: 2,
        grant_type: 'password',
        client_secret: "vlYsLrVT6v7vJSvcSFYcPINzLFxNRdEh3v4fdyYJ",
        username: "",
        password: "",

        userLogged: {},
      },

      logged: false,
    },
    mounted() {
      if(localStorage.access_token != "undefined") {
                console.log("SI!!!")
                this.getUserData()
                this.getItems()
        }

    },
    methods: {
      LogIn() {
        fetch("https://fd79c763.ngrok.io/oauth/token", {
                  method: "post",
                  body: JSON.stringify(this.userData),
                  headers: {
                      'Content-Type': 'application/json'
                  }
                }).then(response => response.json())


                  .then(json => {
                  localStorage.access_token = "Bearer "  + json.access_token
                  this.logged = true
                  this.getUserData()
                  this.getItems()
                })


      },
      logOut() {
        this.logged = false
        localStorage.access_token = undefined
        this.userData.userItems = ""
      },
      showData() {
          console.log(this.userData)

      },

      getItems() {
        fetch("https://fd79c763.ngrok.io/api/item", {
                  method: "get",
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': localStorage.access_token
                  }
                }).then(response => response.json())
                  .then(json => {
                  this.userData.userItems = json
                })

      },
      getUserData() {
        fetch("https://fd79c763.ngrok.io/api/user", {
                  method: "get",
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': localStorage.access_token
                  }
                }).then(response => response.json())
                  .then(json => {
                  this.logged = true
                  this.userData.userLogged = json
                })
      },
    },

    template: `
    <div>
      <div class=card-header>
        <h1 v-if="logged === false" align="center">Login</h1>
        <h1 v-if="logged === true" align="center">Logged - {{ userData.userLogged.name}}</h1>
      </div>
      <div class="container">
        <div class=card v-if="logged === false" >
          <label>User Name: </label>
          <input required v-model="userData.username" type="text" placeholder="User name"/>
          <label>Password: </label>
          <input required v-model="userData.password" type="password" placeholder="Password"/>

          <hr/>
          <button v-on:click="LogIn()" class="btn-success">Login</button>
          </div>

          <div class=card v-if="logged === true" >
          <li v-for= "items in userData.userItems">  {{items.name}}</li>
          <button v-on:click="logOut()" class="btn-warning">Logout</button>
          </div>
        </div>
    </div>
    `,
});
