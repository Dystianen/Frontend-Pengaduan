<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Masyarakat</b></p>
              <p class="card-description float-right">
                <b-button
                  variant="success"
                  v-b-modal.modalMasyarakat
                  v-on:click="Add"
                  >Add</b-button
                >
              </p>
              <div class="table-responsive">
                <b-table striped hover :items="user" :fields="fields">
                  <template v-slot:cell(role)="data">
                    <b-badge variant="warning">{{ data.item.role }}</b-badge>
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button
                      size="sm"
                      variant="info"
                      v-on:click="Edit(data.item)"
                      v-b-modal.modalMasyarakat
                      class="mdi mdi-pencil"
                      >Edit</b-button
                    >
                    <b-button
                      size="sm"
                      variant="danger"
                      class="mdi mdi-delete"
                      v-on:click="Drop(data.item.id)"
                      >Delete</b-button
                    >
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination"
                >
                </b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
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

    <b-modal id="modalMasyarakat" @ok="Save">
      <template v-slot:modal-title> Form Input </template>
      <form ref="form">
        <div class="form-group">
          <label for="nik" class="col-form-label">NIK</label>
          <input
            type="text"
            v-model="nik"
            name="nik"
            class="form-control"
            id="nik"
            placeholder="Nomor Induk Kependudukan"
          />
        </div>
        <div class="form-group">
          <label for="name" class="col-form-label">Name</label>
          <input
            type="text"
            v-model="name"
            name="name"
            class="form-control"
            id="name"
            placeholder="Nama Lengkap"
          />
        </div>
        <div class="form-group">
          <label for="email" class="col-form-label">email</label>
          <input
            type="email"
            v-model="email"
            name="email"
            class="form-control"
            id="email"
            placeholder="Nama Lengkap"
          />
        </div>
        <div class="form-group">
          <label for="password" class="col-form-label">password</label>
          <input
            type="password"
            v-model="password"
            name="password"
            class="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
        <div class="form-group">
          <label for="phone_number" class="col-form-label">phone_number</label>
          <input
            type="number"
            v-model="phone_number"
            name="phone_number"
            class="form-control"
            id="phone_number"
            placeholder="Phone Number"
          />
        </div>
        <div class="form-group">
          <label for="location" class="col-form-label">location</label>
          <input
            type="text"
            v-model="location"
            name="location"
            class="form-control"
            id="location"
            placeholder="location"
          />
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      search: "",
      id: "",
      nik: "",
      name: "",
      email: "",
      password: "",
      phone_number: "",
      location: "",
      role: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      user: [],
      fields: [
        "id",
        "nik",
        "name",
        "email",
        // "password",
        "phone_number",
        "location",
        "role",
        "action",
      ],
    };
  },

  methods: {
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      // let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/user",  conf)
        .then((response) => {
          if (response.data.status) {
            this.$bvToast.hide("loadingToast");
            this.user = response.data.data.user;
            this.rows = response.data.count;
          } else {
            this.$bvToast.hide("loadingToast");
            this.message = "Gagal menampilkan data masyarakat.";
            this.$bvToast.show("message");
            // this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    pagination: function () {
      if (this.search == "") {
        this.getData();
      } else {
        this.searching();
      }
    },

    Add: function () {
      this.action = "insert";
      this.nik = "";
      this.name = "";
      this.email = "";
      this.password = "";
      this.phone_number = "";
      this.location = "";
    },

    Edit: function (item) {
      this.action = "update";
      this.id = item.id;
      this.nik = item.nik;
      this.name = item.name;
      this.email = item.email;
      this.password = item.password;
      this.phone_number = item.phone_number;
      this.location = item.location;
      this.role = item.role;
    },

    Save: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");

      if(this.action === "insert"){
      let form = new FormData();
      form.append("id", this.id);
      form.append("nik", this.nik);
      form.append("name", this.name);
      form.append("email", this.email);
      form.append("password", this.password);
      form.append("phone_number", this.phone_number);
      form.append("location", this.location);
      form.append("role", this.role);

      this.axios
        .post("/user", form, conf)
        .then((response) => {
          this.getData();
          this.$bvToast.hide("loadingToast");
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch((error) => {
          console.log(error);
        });
      } else {
        let form = {
          nik: this.nik,
          name: this.name,
          email: this.email,
          password: this.password,
          phone_number: this.phone_number,
          location: this.location
        }
        this.axios.put("/user/" + this.id, form, conf)
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

    Drop: function (id) {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
        this.$bvToast.show("loadingToast");
        this.axios
          .delete("/user/" + id, conf)
          .then((response) => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  mounted() {
    this.key = localStorage.getItem("Authorization");
    this.getData();
  },
};
</script>