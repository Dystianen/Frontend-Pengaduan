<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card mt-5">
            <div class="card-body">
              <img
                style="width: 100%; height: auto; border-radius: 5%"
                :src="'http://localhost:8000/uploads/' + pengaduan.foto"
              />
              <div class="row">
                <div class="col-6 float-left">
                  <h6 class="mt-5">
                    Tanggal Pengaduan : {{ pengaduan.tgl_pengaduan }}
                  </h6>
                  <h6>Nama Masyarakat : {{ user.nama }}</h6>
                  <h6>
                    Status :
                    <span class="text-danger">{{ pengaduan.status }}</span>
                  </h6>
                </div>
                <div class="col-6" style="text-align: right">
                  <h6 class="mt-5">NIK : {{ user.nik }}</h6>
                  <h6>Email : {{ user.username }}</h6>
                  <h6>No Telepon : {{ user.telp }}</h6>
                </div>
              </div>

              <h6 class="mt-5">Laporan :</h6>
              <h6 style="margin-left: 20px; font-size: 15px; color: grey">
                {{ pengaduan.isi_laporan }}
              </h6>
              <div class="float-right">
                <router-link to="/pengaduan" class="nav-link">
                  <i class="mdi mdi-skip-backward"></i>
                  <span class="menu-title"> back</span>
                </router-link>
              </div>
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
</template>

<script>
module.exports = {
  data: function () {
    return {
      search: "",
      id_pengaduan: this.$route.params.id_pengaduan,
      nama: "",
      tgl_pengaduan: "",
      isi_laporan: "",
      foto: "",
      status: "",
      tanggapan: "",
      id_kategori: "",
      action: "",
      message: "",
      pagination: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      user: [],
      pengaduan: [],
      kategori: [],
      fields: [
        "tanggal",
        // "laporan",
        "kategori",
        "status",
      ],
    };
  },

  methods: {
    getData() {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
      console.log(this.id_pengaduan);
      this.axios
        .get("pengaduan/" + this.id_pengaduan, conf)
        .then((response) => {
          if (response.data.success) {
            this.$bvToast.hide("loadingToast");
            this.pengaduan = response.data.data.pengaduan[0];
            this.user = response.data.data.pengaduan[0].user;
            this.tanggapan = response.data.data.pengaduan.tanggapan;
            this.rows = response.data.data.count;
          } else {
            this.$bvToast.hide("loadingToast");
            this.message = "Gagal menampilkan data Pengaduan.";
            this.$bvToast.show("message");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

  },
  mounted() {
    this.key = localStorage.getItem("Authorization");
    this.getData();
  },
};
</script>