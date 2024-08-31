// Kamus harga barang
const hargaBarang = {
  beras: 10000,
  telur: 2000,
  minyak: 15000,
  mie: 2500,
  kecap: 5000,
};

// Keranjang belanja
let keranjang = [];

// Fungsi untuk menambahkan barang ke dalam keranjang
function tambahKeKeranjang(barang) {
  const barangIndex = keranjang.findIndex((item) => item.nama === barang);

  if (barangIndex >= 0) {
    keranjang[barangIndex].jumlah++;
  } else {
    keranjang.push({ nama: barang, jumlah: 1, harga: hargaBarang[barang] });
  }

  tampilkanKeranjang();
}

// Fungsi untuk menghapus barang dari keranjang
function hapusDariKeranjang(barang) {
  keranjang = keranjang.filter((item) => item.nama !== barang);
  tampilkanKeranjang();
}

// Fungsi untuk menampilkan keranjang belanja di tabel
function tampilkanKeranjang() {
  const tbody = document.querySelector("#keranjang tbody");
  tbody.innerHTML = "";

  keranjang.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.jumlah}</td>
            <td>Rp${item.harga.toLocaleString()}</td>
            <td>Rp${(item.harga * item.jumlah).toLocaleString()}</td>
            <td><button onclick="hapusDariKeranjang('${
              item.nama
            }')">Hapus</button></td>
        `;

    tbody.appendChild(row);
  });

  hitungTotal();
}

// Fungsi untuk menghitung total harga di keranjang
function hitungTotal() {
  const total = keranjang.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );
  document.getElementById("total-harga").textContent = total.toLocaleString();
}

// overlay
const overlay = document.querySelector(".overlay");

// fungsi peringatan
const peringatan = document.querySelector(".peringatan");
const close = document.querySelector(".close");
function tanda() {
  peringatan.classList.add("active");
  overlay.classList.add("active");
  close.addEventListener("click", () => {
    peringatan.classList.remove("active");
    overlay.classList.remove("active");
  });
}

// tanggal waktu
const date = new Date();
const tanggal = date.toLocaleDateString();

const jam = date.getHours().toString().padStart(2, "0");
const menit = date.getMinutes().toString().padStart(2, "0");
const detik = date.getSeconds().toString().padStart(2, "0");
const waktu = `${jam}: ${menit}: ${detik}`;

// Fungsi untuk memproses pembayaran
// Fungsi untuk memproses pembayaran
function prosesPembayaran() {
  const text = document.getElementById("text");
  const jumlahUang = parseInt(document.getElementById("jumlahUang").value);
  const totalHarga = keranjang.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );
  const hasil = document.getElementById("hasil");

  // Pengecekan jika keranjang kosong
  if (keranjang.length === 0) {
    tanda();
    text.innerHTML =
      'Tidak ada barang yang dipilih <i class="fa-solid fa-circle-exclamation"></i>';
    return;
  }

  if (isNaN(jumlahUang) || jumlahUang <= 0) {
    tanda();
    text.innerHTML =
      'Masukkan jumlah uang yang valid <i class="fa-solid fa-circle-exclamation"></i>';
    return;
  }

  const selisih = jumlahUang - totalHarga;

  if (selisih < 0) {
    const pembeli = document.querySelector(".pembeli");
    const inputNamaPembeli = document.getElementById("ngutang");
    const ok = document.querySelector("#ok");

    // Kosongkan input nama pembeli setiap kali modal dibuka
    inputNamaPembeli.value = "";

    // Tampilkan modal
    pembeli.classList.add("active");
    overlay.classList.add("active");

    // Hapus event listener lama sebelum menambahkannya kembali
    ok.removeEventListener("click", handleOkClick);
    ok.addEventListener("click", handleOkClick);
  } else if (selisih > 0) {
    hasil.innerHTML = `
          <strong>Tanggal: ${tanggal}, Waktu: ${waktu}</strong><br>
          Total Harga: Rp${totalHarga.toLocaleString()}<br>
          Jumlah Uang: Rp${jumlahUang.toLocaleString()}<br>
          Kembalian: Rp${selisih.toLocaleString()}`;
  } else {
    hasil.innerHTML = `
    <strong>Tanggal: ${tanggal}, Waktu: ${waktu}</strong><br>
          Total Harga: Rp${totalHarga.toLocaleString()}<br>
          Jumlah Uang: Rp${jumlahUang.toLocaleString()}<br>
          Uang Pas
      `;
  }

  // Reset keranjang jika transaksi selesai
  if (selisih >= 0) {
    keranjang = [];
    tampilkanKeranjang();
    document.getElementById("jumlahUang").value = "";
  }
}

// Fungsi handler untuk tombol OK
function handleOkClick() {
  const pembeli = document.querySelector(".pembeli");
  const inputNamaPembeli = document.getElementById("ngutang");
  const hasil = document.getElementById("hasil");
  const jumlahUang = parseInt(document.getElementById("jumlahUang").value);
  const totalHarga = keranjang.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );
  const selisih = jumlahUang - totalHarga;

  const namaPembeli = inputNamaPembeli.value.trim();
  if (namaPembeli === "") {
    alert("Nama pembeli harus diisi!");
    return;
  }

  pembeli.classList.remove("active"); // Sembunyikan modal
  overlay.classList.remove("active");

  hasil.innerHTML = `
  <strong>Tanggal: ${tanggal}, Waktu: ${waktu}</strong><br>
      Nama pembeli: ${namaPembeli}<br>
      Total Harga: Rp${totalHarga.toLocaleString()}<br>
      Jumlah Uang: Rp${jumlahUang.toLocaleString()}<br>
      Jumlah Kurang: Rp${(-selisih).toLocaleString()}
  `;

  // Reset keranjang setelah pembayaran
  keranjang = [];
  tampilkanKeranjang();
  document.getElementById("jumlahUang").value = "";
}

// Menambahkan barang ke dalam daftar barang
function tampilkanDaftarBarang() {
  const barangContainer = document.getElementById("barang-container");

  Object.keys(hargaBarang).forEach((barang) => {
    const div = document.createElement("div");
    div.className = "barang-item";
    div.textContent = `${
      barang.charAt(0).toUpperCase() + barang.slice(1)
    } - Rp${hargaBarang[barang].toLocaleString()}`;
    div.onclick = () => tambahKeKeranjang(barang);

    barangContainer.appendChild(div);
  });
}

// Inisialisasi aplikasi kasir
tampilkanDaftarBarang();
