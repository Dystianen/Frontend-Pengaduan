<template>
  <div>
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="main-panel">
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
                      id="lbl_username"
                      label="Username"
                      label-for="input_username"
                    >
                      <b-form-input
                        id="input_username"
                        v-model="username"
                        placeholder="Alamat username"
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
                    <h6 class="font-weight-light">
                      <a v-b-modal.modalRegister v-on:click="Add"
                        >Anda belum mempunyai akun petugas?</a
                      >
                    </h6>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <b-modal id="modalRegister" @ok="Save">
          <template v-slot:modal-title> Form Register </template>
          <form ref="form">
            <div class="form-group">
              <label for="nik" class="col-form-label">NIK</label>
              <input
                type="number"
                name="nik"
                class="form-control"
                id="nik"
                placeholder="nik"
                v-model="nik"
              />
            </div>
            <div class="form-group">
              <label for="nama" class="col-form-label">Nama</label>
              <input
                type="text"
                name="nama"
                class="form-control"
                id="nama"
                placeholder="name"
                v-model="nama"
              />
            </div>
            <div class="form-group">
              <label for="username" class="col-form-label">Username</label>
              <input
                type="text"
                name="username"
                class="form-control"
                id="username"
                placeholder="username"
                v-model="username"
              />
            </div>
            <div class="form-group">
              <label for="password" class="col-form-label">Password</label>
              <input
                type="password"
                name="password"
                class="form-control"
                id="password"
                placeholder="password"
                v-model="password"
              />
            </div>
            <div class="form-group">
              <label for="telp" class="col-form-label">Telepon</label>
              <input
                type="integer"
                name="telp"
                class="form-control"
                id="telp"
                placeholder="telepon"
                v-model="telp"
              />
            </div>
          </form>
        </b-modal>
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
      nama: "",
      telp: "",
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    Login: function () {
      this.$bvToast.show("loadingToast");
      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then((response) => {
          localStorage.setItem('nama', response.data.data.user.nama);
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
      this.nama = "";
      this.username = "";
      this.password = "";
      this.telp = "";
      this.level = "";
    },

    Save : function(){
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id", this.id);
        form.append("nik", this.nik);
        form.append("nama", this.nama);
        form.append("username", this.username);
        form.append("password", this.password);
        form.append("telp", this.telp);

        this.axios.post("/registerPetugas", form)
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
          nama: this.nama,
          username: this.username,
          password: this.password,
          telp: this.telp,
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
