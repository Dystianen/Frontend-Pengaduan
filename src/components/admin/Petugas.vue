<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Petugas</b></p>
              <div class="table-responsive">
                <b-table striped hover :items="user" :fields="fields">
                  <template v-slot:cell(level)="data">
                    <b-badge variant="warning">{{ data.item.level }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="info" v-on:click="Edit(data.item)" v-b-modal.modalTatib><i class="mdi mdi-pencil btn-icon-prepend"></i> Edit</b-button>&nbsp;
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)"><i class="mdi mdi-delete btn-icon-prepend"></i> Delete</b-button>
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination">
                </b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="secondary"></b-spinner>
                  <strong class="text-secondary"> Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal 
      id="modalTatib"
      @ok="Save"
    >
      <template v-slot:modal-title>
        Form Petugas
      </template>
        <form ref="form">
          <div class="form-group">
            <label for="nik" class="col-form-label">NIK</label>
            <input type="number" name="nik" class="form-control" id="nik" placeholder="nik" v-model="nik">
          </div>
          <div class="form-group">
            <label for="nama" class="col-form-label">Nama Petugas</label>
            <input type="text" name="nama" class="form-control" id="nama" placeholder="name" v-model="nama">
          </div>
          <div class="form-group">
            <label for="telp" class="col-form-label">Telepon</label>
            <input type="number" name="telp" class="form-control" id="telp" placeholder="telepon" v-model="telp">
          </div>
          <div class="form-group">
            <label for="username" class="col-form-label">Username</label>
            <input type="text" name="username" class="form-control" id="username" placeholder="username" v-model="username">
          </div>
          <div class="form-group">
            <label for="password" class="col-form-label">Password</label>
            <input type="password" name="password" class="form-control" id="password" placeholder="Kata Sandi" v-model="password">
          </div>
        </form>
    </b-modal>

  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      search: "",
      id: "",
      nik: "",
      nama: "",
      telp: "",
      username: "",
      password: "",
      level: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      user: [],
      fields: ["id", "nik", "nama", "telp", "username", "level"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/petugas/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.success){
          this.$bvToast.hide("loadingToast");
          this.user = response.data.data.user;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data petugas."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id", this.id);
        form.append("nama", this.nama);
        form.append("username", this.username);
        form.append("password", this.password);
        form.append("level", this.level);

        this.axios.post("/petugas", form, conf)
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
      } else {
        let form = {
          nama: this.nama,
          username: this.username,
          password: this.password,
          level: this.level
        }
        this.axios.put("/petugas/" + this.id, form, conf)
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

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/petugas/" + id, conf)
        .then(response => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();
  }
}
</script>