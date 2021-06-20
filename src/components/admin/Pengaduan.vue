<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left text-warning"><b>Data Pengaduan</b></p>
              <div class="table-responsive">
                <b-table striped hover :items="pengaduan" :fields="fields" style="font-size: 24px">
                  <template v-slot:cell(status)="data">
                    {{ data.item.status }}
                  </template>

                  <template v-slot:cell(id)="data">
                    {{ data.item.id_pengaduan }}
                  </template>

                  <template v-slot:cell(laporan)="data">
                    {{ data.item.isi_laporan }}
                  </template>

                  <template v-slot:cell(masyarakat)="data">
                    {{ data.item.user.nama }}
                  </template>

                  <template v-slot:cell(tanggal)="data">
                    {{ data.item.tgl_pengaduan }}
                  </template>

                  <template v-slot:cell(kategori)="data">
                    {{ data.item.kategori.nama_kategori }}
                  </template>
                  <template v-slot:cell(tanggapan)="data">
                    {{ data.item.tanggapan !== null ? data.item.tanggapan.tanggapan : null }}
                  </template>
                  <template v-slot:cell(foto)="data">
                    <img style="width: 200px; height: 100px; border-radius: 5%" :src="'http://localhost:8000/uploads/' + data.item.foto" />
                  </template>
                  <template v-slot:cell(action)="data">
                    <div style="display: flex; flex-direction: row; justify-content: center;">
                      <button type="button" class="btn btn-link text-dark" @click="Detail(data.item.id_pengaduan)" to="/detail">
                        <i class="mdi mdi-eye btn-icon-prepend"></i>
                      </button>
                      <button type="button" class="btn btn-link text-dark" v-on:click="Edit(data.item)" v-b-modal.modalStatus>
                        <i class="mdi mdi-checkbox-marked-circle-outline btn-icon-prepend"></i>
                      </button>
                      <button type="button" class="btn btn-link text-dark" @click="generateReport(data.item.id_pengaduan)">
                        <i class="mdi mdi-file-document btn-icon-prepend"></i>
                      </button>
                      <button type="button" class="btn btn-link text-dark" v-on:click="insertTanggapan(data.item)" v-b-modal.modalTanggapan><i class="mdi mdi-pencil btn-icon-prepend"></i></button>
                    </div>
                  </template>
                </b-table>

                <div>
                  <vue-html2pdf
                    :show-layout="false"
                    :float-layout="true"
                    :enable-download="false"
                    :preview-modal="true"
                    :paginate-elements-by-height="1400"
                    filename="Laporan"
                    :pdf-quality="2"
                    :manual-pagination="false"
                    pdf-format="a4"
                    pdf-orientation="portrait"
                    pdf-content-width="800px"
                    @hasStartedGeneration="hasStartedGeneration()"
                    @hasGenerated="hasGenerated($event)"
                    ref="html2Pdf"
                  >
                    <section slot="pdf-content">
                      <div class="invoice-box">
                        <table style="width: 100%">
                          <tr class="top">
                            <td colspan="2">
                              <table>
                                <tr>
                                  <td class="title">
                                    <img src="../../../public/12.png" alt="Company logo" style="width: 100%; max-width: 150px" />
                                  </td>

                                  <td>
                                    Invoice #: {{ report.isi_laporan }}<br />
                                    <br />
                                    kategori :
                                    {{ reportKategori.nama_kategori }} <br />

                                    {{ report.created_at | formatDate }}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <tr class="information">
                            <td colspan="2">
                              <table>
                                <tr>
                                  <td>REPORT :</td>

                                  <td>
                                    {{ reportTanggapan.tanggapan }}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <table>
                            <tr class="heading">
                              <b>Data Pengaduan : </b>
                            </tr>

                            <tr class="item">
                              <td>NIK</td>
                              <td>{{ reportUser.nik }}</td>
                            </tr>

                            <tr class="item">
                              <td>Nama</td>

                              <td>{{ reportUser.nama }}</td>
                            </tr>

                            <tr class="item">
                              <td>Tanggal Pengaduan</td>

                              <td>{{ report.tgl_pengaduan | format }}</td>
                            </tr>

                            <tr class="item">
                              <td>Isi Laporan</td>

                              <td>{{ report.isi_laporan }}</td>
                            </tr>

                            <tr class="item last">
                              <td>Bukti Foto</td>

                              <td>
                                <img
                                  v-if="report.foto"
                                  style="
                                    width: 100px;
                                    height: 100px;
                                    border-radius: 10%;
                                  "
                                  :src="'http://localhost:8000/uploads/' + report.foto"
                                />
                              </td>
                            </tr>
                          </table>
                        </table>
                      </div>
                    </section>
                  </vue-html2pdf>
                </div>

                <b-modal id="modalStatus" @ok="Status">
                  <template v-slot:modal-title> Form Update </template>
                  <form ref="form">
                    <div class="form-group">
                      <label for="status" class="col-form-label">Status</label>
                      <select class="form-control" name="status" id="status" v-model="status" aria-placeholder="terkirim">
                        <option value="terkirim" disabled selected>
                          Terkirim
                        </option>
                        <option value="proses">Proses</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </div>
                  </form>
                </b-modal>

                <b-modal id="modalTanggapan" @ok="Tanggapan">
                  <template v-slot:modal-title> Form Tanggapan </template>
                  <form ref="form">
                    <div class="form-group">
                      <label for="tanggapan" class="col-form-label">Tanggapan</label>
                      <textarea class="form-control" id="tanggapan" name="tanggapan" rows="3" placeholder="" type="text" v-model="tanggapan"></textarea>
                    </div>
                  </form>
                </b-modal>
                <b-pagination v-model="currentPage" :per-page="perPage" :total-rows="rows" align="center" v-on:input="pagination"> </b-pagination>

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
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf';

export default {
  data: function() {
    return {
      search: '',
      id_pengaduan: '',
      id_user: '',
      id_tanggapan: '',
      id_kategori: '',
      tgl_pengaduan: '',
      isi_laporan: '',
      foto: '',
      status: '',
      tanggapan: '',
      action: '',
      detail: '',
      message: '',
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: '',
      report: '',
      reportUser: '',
      reportTanggapan: '',
      reportKategori: '',
      user: [],
      pengaduan: [],
      fields: ['id', 'masyarakat', 'tanggal', 'kategori', 'status', 'action'],
    };
  },

  methods: {
    getData() {
      let conf = { headers: { Authorization: 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show('loadingToast');
      this.axios
        .get('/pengaduan/' + this.perPage + '/' + offset, conf)
        .then((response) => {
          if (response.data.success) {
            this.$bvToast.hide('loadingToast');
            this.pengaduan = response.data.data.pengaduan;
            this.pengaduanNama = response.data.data.pengaduan[0].nama;
            this.rows = response.data.data.count;
          } else {
            this.$bvToast.hide('loadingToast');
            this.message = 'Gagal menampilkan data Pengaduan.';
            this.$bvToast.show('message');
            this.$router.push({ name: 'login' });
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    Detail(id_pengaduan) {
      let conf = { headers: { Authorization: 'Bearer ' + this.key } };
      this.$bvToast.show('loadingToast');
      this.axios
        .get('/pengaduan/' + id_pengaduan, conf)
        .then((response) => {
          if (response.data.success) {
            this.$bvToast.hide('loadingToast');
            this.pengaduan = response.data.data.pengaduan[0];
            this.user = response.data.data.pengaduan[0].user;
            this.rows = response.data.data.count;
          } else {
            this.$bvToast.hide('loadingToast');
            this.message = 'Gagal menampilkan detail pengaduan.';
            this.$bvToast.show('message');
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.$router.push({
        name: 'detail',
        params: { id_pengaduan: id_pengaduan },
      });
    },

    getTanggapan: function() {
      let conf = { headers: { Authorization: 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show('loadingToast');
      this.axios
        .get('/masyarakat/' + this.perPage + '/' + offset, conf)
        .then((response) => {
          if (response.data.success) {
            this.$bvToast.hide('loadingToast');
            this.pengaduan = response.data.data.pengaduan;
            this.rows = response.data.data.count;
          } else {
            this.$bvToast.hide('loadingToast');
            this.message = 'Gagal menampilkan data Pengaduan.';
            this.$bvToast.show('message');
            this.$router.push({ name: 'login' });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    pagination: function() {
      if (this.search == '') {
        this.getData();
      } else {
        this.searching();
      }
    },

    Edit: function(item) {
      this.action = 'update';
      this.id_pengaduan = item.id_pengaduan;
      this.tgl_pengaduan = item.tgl_pengaduan;
      this.status = item.status;
      this.tanggapan = item.tanggapan;
    },

    insertTanggapan: function(item) {
      this.action = 'insert';
      this.id_pengaduan = item.id_pengaduan;
      this.tanggapan = ' ';
    },

    Status: function() {
      let conf = { headers: { Authorization: 'Bearer ' + this.key } };
      this.$bvToast.show('loadingToast');
      this.action === 'update';
      let form = new FormData();
      form.append('id_pengaduan', this.id_pengaduan);
      form.append('tgl_pengaduan', this.tgl_pengaduan);
      form.append('status', this.status);
      // form.append("tanggapan", this.tanggapan);

      this.axios
        .post('/pengaduan/status', form, conf)
        .then((response) => {
          if (response.data.success) {
            this.$bvToast.hide('loadingToast');
            this.message = 'Status berhasil diupdate';
            this.$bvToast.show('message');
            this.pengaduan = response.data.data.pengaduan;
            this.rows = response.data.data.count;
            this.getData();
          } else {
            this.$bvToast.hide('loadingToast');
            this.message = 'Gagal update status';
            this.$bvToast.show('message');
            this.$router.push({ name: 'login' });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    Tanggapan: function() {
      let conf = { headers: { Authorization: 'Bearer ' + this.key } };
      this.$bvToast.show('loadingToast');
      this.action === 'insert';
      let form = new FormData();
      form.append('id_pengaduan', this.id_pengaduan);
      form.append('tanggapan', this.tanggapan);

      this.axios
        .post('/pengaduan/tanggapan', form, conf)
        .then((response) => {
          if (response.data.success) {
            this.pengaduan = response.data.data.pengaduan;
            this.rows = response.data.data.count;
            this.$bvToast.hide('loadingToast');
            this.message = 'Tanggapan berhasil ditambahkan';
            this.$bvToast.show('message');
            this.getTanggapan();
            this.getData();
          } else {
            this.$bvToast.hide('loadingToast');
            this.message = 'Gagal mengajukan tanggapan';
            this.$bvToast.show('message');
            this.$router.push({ name: 'login' });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    Drop: function(id) {
      let conf = { headers: { Authorization: 'Bearer ' + this.key } };
      if (confirm('Apakah anda yakin ingin menghapus data ini?')) {
        this.$bvToast.show('loadingToast');
        this.axios
          .delete('/petugas/' + id, conf)
          .then((response) => {
            this.getData();
            this.$bvToast.hide('loadingToast');
            this.message = response.data.message;
            this.$bvToast.show('message');
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    generateReport(id_pengaduan) {
      let conf = { headers: { Authorization: 'Bearer ' + this.key } };
      this.$bvToast.show('loadingToast');
      this.axios
        .get('/pengaduan/' + id_pengaduan, conf)
        .then((response) => {
          if (response.data.success) {
            this.$bvToast.hide('loadingToast');
            this.report = response.data.data.pengaduan[0];
            this.reportUser = response.data.data.pengaduan[0].user;
            this.reportTanggapan = response.data.data.pengaduan[0].tanggapan;
            this.reportKategori = response.data.data.pengaduan[0].kategori;
            this.rows = response.data.data.count;
            this.$refs.html2Pdf.generatePdf();
          } else {
            this.$bvToast.hide('loadingToast');
            this.message = 'Gagal menampilkan data laporan.';
            this.$bvToast.show('message');
            this.$router.push({ name: 'login' });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.key = localStorage.getItem('Authorization');
    this.getData();
  },

  components: {
    VueHtml2pdf,
  },
};
</script>

<style scoped>
body {
  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #777;
}

body h1 {
  font-weight: 300;
  margin-bottom: 0px;
  padding-bottom: 0px;
  color: #000;
}

body h3 {
  font-weight: 300;
  margin-top: 10px;
  margin-bottom: 20px;
  font-style: italic;
  color: #555;
}

body a {
  color: #06f;
}

.invoice-box {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  border: 1px solid #000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 24px;
  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
  border-collapse: collapse;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 50px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}
</style>
