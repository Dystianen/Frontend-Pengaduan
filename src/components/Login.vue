<template>
  <div>
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="main-panel login">
          <div class="content-wrapper d-flex align-items-center auth">
            <div class="row w-100">
              <div class="col-lg-4 mx-auto">
                <div class="auth-form-light text-left p-5">
                  <!-- <div class="navbar-brand brand-logo">
                        <img src="../assets/logo.png" style="width: 100px">
                      </div> -->
                  <h4>Selamat datang!</h4>
                  <h6 class="font-weight-light">
                    Silahkan login terlebih dahulu
                  </h6>
                  <form v-on:submit.prevent="Login">
                    <b-form-group
                      id="lbl_email"
                      label="Email"
                      label-for="input_email"
                    >
                      <b-form-input
                        id="input_email"
                        v-model="email"
                        placeholder="Alamat email"
                        trim
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group
                      id="lbl_password"
                      label="Password"
                      label-for="input_password"
                    >
                      <b-form-input
                        type="password"
                        id="input_password"
                        v-model="password"
                        placeholder="Kata sandi"
                        trim
                      ></b-form-input>
                    </b-form-group>

                    <b-button variant="secondary" block type="submit"
                      >Login
                    </b-button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- content-wrapper ends -->
      </div>
      <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
        <b-spinner label="Spinning" variant="secondary"></b-spinner>
        <strong class="text-secondary">Loading...</strong>
      </b-toast>
      <!-- toast untuk tampilan message box -->
      <b-toast id="message" title="Message">
        <strong class="text-success">{{ message }}</strong>
      </b-toast>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: "",
      nik: "",
      name: "",
      phone_number: "",
      email: "",
      password: "",
      message: "",
    };
  },
  methods: {
    Login: function () {
      this.$bvToast.show("loadingToast");
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch("login", { email, password })
        .then((response) => {
          localStorage.setItem('name', response.data.data.user.name);
          this.message = response.data.message;
          this.$bvToast.hide("loadingToast");
          this.$bvToast.show("message");
          this.$router.push("/");
        })
        .catch((err) => console.log(err));
    },

    Add: function () {
      this.action = "insert";
      this.nik = "";
      this.name = "";
      this.email = "";
      this.password = "";
      this.phone_number = "";
      this.role = "";
    },

    Save : function(){
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id", this.id);
        form.append("nik", this.nik);
        form.append("name", this.name);
        form.append("email", this.email);
        form.append("password", this.password);
        form.append("phone_number", this.phone_number);

        this.axios.post("/register", form)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          this.$router.push('/login')
          this.message = response.data.message;
          this.$bvToast.show("message");
        })  
        .catch(error => {
          console.log(error);
        });
      } else {
        let form = {
          nik: this.nik,
          name: this.name,
          email: this.email,
          password: this.password,
          phone_number: this.phone_number,
        }
        this.axios.put("/login" + this.id, form)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
};
</script>
