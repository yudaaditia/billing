import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {
  success,
  warning,
  danger, 
  successCharge,
  questionCharge
} from './utils/alert/index.js';


const Billing = (props) => {
  const [kategoris, setKategoris]           = useState([]);
  const [menu, setMenu]                     = useState([]);
  const [favorite, setFavorite]             = useState([]);
  const [aktivitas, setAktivitas]           = useState([]);
  const [viewMenu, setViewMenu]             = useState(false);
  const [count, setCount]                   = useState(0);
  const [countAntrian, setCountAntrian]     = useState(0);
  const [billing, setBilling]               = useState([]);
  const [nama, setNama]                     = useState('');
  const [subTotal, setSubTotal]             = useState(0);
  const [diskon, setDiskon]                 = useState(0);
  const [disk, setDisk]                     = useState(0);
  const [diskons, setDiskons]               = useState([]);
  const [total, setTotal]                   = useState(0);
  const [kembali, setKembali]               = useState('');
  const [tunai, setTunai]                   = useState(0);
  const [antrians, setAntrians]             = useState([]);
  const [editAntrian, setEditAntrian]       = useState(false);
  const [idAntrian, setIdAntrian]           = useState('');
  const [kategoriId, setKategoriId]         = useState(0);
  const [search, setSearch]                 = useState([]);
  const [viewSearch, setViewSearch]         = useState(false);
  const [antriansSearch, setAntriansSearch] = useState(false);
  const [menusSearch, setMenusSearch]       = useState([]);
  const [tempBilling, setTempBilling]       = useState([]);

  const uriKategori       = `${props.url.url}/kasir/api/kategori`;
  const uriFavorite       = `${props.url.url}/kasir/api/favorite`;
  const uriMenu           = `${props.url.url}/kasir/api/menu/`;
  const uriDiskon         = `${props.url.url}/kasir/api/diskon`;
  const uriAktivitas      = `${props.url.url}/kasir/api/aktivitas`;
  const uriPesanan        = `${props.url.url}/kasir/api/chargePesanan`;
  const uriDetailPesanan  = `${props.url.url}/kasir/api/chargeDetailPesanan`;
  const uriAddFavorite    = `${props.url.url}/kasir/api/addFavorite`;
  const uriMenusSearch    = `${props.url.url}/kasir/api/menussearch`;
  const uriAddAntrian     = `${props.url.url}/kasir/api/addAntrian`;
  const uriAntrian        = `${props.url.url}/kasir/api/antrian`;
  const uriEditAntrian    = `${props.url.url}/kasir/api/editAntrian`;
  const uriRemoveAntrian  = `${props.url.url}/kasir/api/removeAntrian`;

  useEffect(() => {
    console.log(props.url.url);
    getAktivitas();
    getKategori();
    getDiskon();
    favoriteHandle();
    totalCharge();

    setTimeout(() => {
      getMenusSearch(); 
    },3000);
    return () => {
      
    };
  }, []);

  
const getMenusSearch = () => {
  axios.get(uriMenusSearch)
     .then(response => {
      setMenusSearch(response.data);
       console.log('menus =>', response.data );
     })
     .catch(function (error) {
       console.log(error);
     })
}

const addBilling = (item) => {
  console.log('menu', item);
  let bi;
  bi = billing;
  let found = false;
  bi.map((bill) => {
    if(bill.id === item.id)
      {             
          bill.jumlah += 1;
          return found = true;
      } 
           
  })
  if(found){
    setBilling(bi);
    setCount(count + 1) 
    totalCharge();
    return console.log('sesudahnya ',bi);
  }
  let bill = {
      'id' : item.id,
      'nama' : item.nama,
      'jumlah' : 1,
      'harga' : item.jual
    };
    let billings = [];
    billings = billing;
    billings.push(bill);
    setBilling(billings);
    totalCharge();
    setCount(count + 1);
}

// tambah kurang pesanan
const actionBilling = (item, action) => {
  let bi
  bi = billing;
  bi.map((bill, key) => {
    if(bill.id === item.id)
      {     
          if(action)
          {
            setCount(count + 1);
            bill.jumlah += 1;
            return; 
          } else {
            bill.jumlah -= 1;
            // jika 0 hapus
            if(bill.jumlah == 0)
            {
              setCount(count - 1);
              return bi.splice(key, 1);
            }
            setCount(count - 1);
            return ;
          }
      }       
  });
  if(bi < 1){
    setCount(0);
  }
  setBilling(bi);
  totalCharge();
}

const deleteBilling = (key, jumlah) => {
  let bi = billing;
  bi.splice(key, 1);
  setCount(count - jumlah);
  totalCharge();
  return setBilling(bi);
}

const totalCharge = () => {
  let sub = 0;
  for (var i = 0; i < billing.length; i++) {
    sub += parseInt(billing[i].harga)  * parseInt(billing[i].jumlah);  
  }
  setSubTotal(parseInt(sub));
  let disks = (diskon / 100) * sub;
  setDisk(parseInt(disk));
  console.log('diskon =>', disks);
  console.log('subtotal =>', subTotal);
  setTotal(sub - disks);
  setKembali(parseInt((sub - disks) - tunai));
  setCount(count);      
}

const totalChargeAntrianEdit = (billings) => {
  let sub = 0;
  for (var i = 0; i < billings.length; i++) {
    sub += parseInt(billings[i].harga)  * parseInt(billings[i].jumlah);  
  }
  setSubTotal(parseInt(sub));
  let disks = (diskon / 100) * sub;
  setDisk(parseInt(disk));
  console.log('diskon =>', disks);
  console.log('subtotal =>', subTotal);
  setTotal(sub - disks);
  setKembali(parseInt((sub - disks) - tunai));
  setCount(count);      
}

const onChangeTunaiHandle = (value) => {
  setTunai(value);
  setKembali(value - parseInt(total));
}

const onChangeDiskon = (value) => {
  setDiskon(parseInt(value));
  let disks = (value / 100) * subTotal;
  setDisk(parseInt(disks));
  console.log('diskon =>', disk);
  setTotal(subTotal - disks);
  setKembali(parseInt((subTotal - disks) - tunai));
  console.log(value);
}

const getKategori = () => {
  
  axios.get(uriKategori)
     .then(response => {
      setKategoris(response.data);
       console.log('Kategori =>', response.data );
     })
     .catch(function (error) {
       console.log(error);
     })
}

const getDiskon = () => {
  axios.get(uriDiskon)
     .then(response => {
      setDiskons(response.data);
       console.log('Diskon =>', response.data );
     })
     .catch(function (error) {
       console.log(error);
     })
}

const getAktivitas = () => {
  axios.get(uriAktivitas)
   .then(response => {
    setAktivitas(response.data);
     console.log('aktivitas =>', response.data );
   })
   .catch(function (error) {
     console.log(error);
   })
}

const favoriteHandle = () => {
  setKategoriId(0);
  setViewMenu(false);
  axios.get(uriFavorite)
     .then(response => {
      setFavorite(response.data);
      console.log('Favorite => ', response.data);
     })
     .catch(function (error) {
       console.log(error);
     })
}

const menuHandle = (kategoriId) => {
  setKategoriId(kategoriId);
  setViewMenu(true);
  let uri = `${uriMenu}${kategoriId}`;
  axios.get(uri)
     .then(response => {
      setMenu(response.data);
       console.log('MEnus =>', response.data );
     })
     .catch(function (error) {
       console.log(error);
     })
}

const favoriteMenu = favorite.map((item) =>
  (<div className="mt-3 shadow rounded-lg mt-0"  style={{width: '150px', position: 'relative', alignItems: 'center',}}>
    <div className="card-text text-warning" style={{position: 'absolute', top: '5px', right: '5px', fontSize: '20px'}} onClick={() => addFavorite(item.menu.id)} ><i className=" fas fa-star" ></i></div>
    <div className="" onClick={() => addBilling(item.menu)}>
       {
        item.menu.image ?
        <img src={props.url.url+'/kasir/menu/image/'+item.menu.image} height="150" width="200" className="card-img-top rounded-lg" alt="..." />
        : 
        <img src="https://via.placeholder.com/150" height="150" width="200" className="card-img-top rounded-lg" alt="..." />
       }
      <div style={{position: 'absolute', bottom: '0px', opacity: '0.8', width: '100%'}} className="text-white text-center bg-dark py-1 rounded-bottom">
          <div className="card-text text-white text-center" >{item.menu.nama}</div>
      </div>
    </div>
  </div>)
);

const menuView = menu.length ? menu.map((item) => 
 (<div  className="mt-3 shadow rounded-lg mt-0"  style={{width: '150px', position: 'relative', alignItems: 'center',}}>
    <div className={`card-text, text-${item.favorite ? 'warning' : 'light'}`} style={{position: 'absolute', top: '5px', right: '5px', fontSize: '20px'}} onClick={() => addFavorite(item.id)} ><i className=" fas fa-star" ></i></div>
    <div className="" onClick={() => addBilling(item)}>
       {
        item.image ?
        <img src={props.url.url+'/kasir/menu/image/'+item.image} height="150" width="200" className="card-img-top rounded-lg" alt="..." />
        : 
        <img src="https://via.placeholder.com/150" height="150" width="200" className="card-img-top rounded-lg" alt="..." />
       }
      <div style={{position: 'absolute', bottom: '0px', opacity: '0.8', width: '100%'}} className="text-white text-center bg-dark py-1 rounded-bottom">
          <div className="card-text text-white text-center" >{item.nama}</div>
      </div>
    </div>
  </div>) 
)
  :
  <h2 className="text-warning mt-4">Tidak Ditemukan!</h2> ;

const formatRupiah = (angka) => {
  if(!angka){
    return;
  }
 let reverse = angka.toString().split('').reverse().join(''),
 ribuan = reverse.match(/\d{1,3}/g);
 ribuan = ribuan.join('.').split('').reverse().join('');
 return ribuan;
}

const antrianHandle = () => {
  axios.post(uriAddAntrian, { nama, billing })
  .then(response => {
    console.log('add antrian =>', response.data );    
  }) 
  .catch(error => {
    console.log(error);
    danger();
  })  
  clearBilling();
}

const getAntrian = () => {
  console.log('id ' , idAntrian);
  axios.get(uriAntrian)
   .then(response => {
    setCountAntrian(response.data.lenght);
    setAntrians(response.data);
     console.log('uriAntrian =>', response.data);
   })
   .catch(function (error) {
     console.log(error);
   })
}

const antrianHandleEdit = () => {
  axios.post(uriEditAntrian, {idAntrian, billing} )
   .then(response => {
     console.log('uriEditAntrian =>', response.data);
     clearBilling();
   })
   .catch(function (error) {
     danger();
     console.log(error);
   })
}

const onChangeSearchAntrian = (value) => {
  if(value.length > 0){
    let ant = antrians.filter(item => {
      return item.nama.toLowerCase().match(value.toLowerCase());
    })
    setAntriansSearch(ant);      
  } else {
    setAntriansSearch([]);    
  }
}

const deleteAntrian = (id) => {
 axios.post(uriRemoveAntrian, {id} )
 .then(response => {
   console.log('RemoveAntrian =>', response.data);
   setCountAntrian(response.data.lenght);
   setAntrians(response.data);
 })
 .catch(function (error) {
   danger();
   console.log(error);
 })
}

const deleteAntrianCharge = () => {
  let ant = antrians; 
  let kunci = 0;
  let i = 0; 
  ant.map((item) => {
    
    if(item.nama == nama){
      kunci = i;
    } else {
      i++;
    }
  });    
  console.log('kunci', kunci);
  ant.splice(kunci, 1);
  setCountAntrian(ant.length);
  setAntrians(ant);
  localStorage.setItem('antrians', JSON.stringify(antrians));
  console.log('delete antrian Charge= ',ant);
}

const formatWaktu = () => {
  let d = new Date();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[d.getDay()];
  let hr = d.getHours();
  let min = d.getMinutes();
  let sec = d.getSeconds();
  let time = `${hr}:${min}:${sec}`;
  return time;
}

const pilihAntrianHandle = (item) => {
  let ant = _.cloneDeep(antrians);
  let bil = ant.filter(ite => ite.nama == item.nama);

  console.log('billing => ', bil[0].detail_antrian);
  setIdAntrian(item.id);
  setBilling(bil[0].detail_antrian);
  setNama(item.nama);
  setEditAntrian(true);
  console.log('id => ',idAntrian);
  totalChargeAntrianEdit(bil[0].detail_antrian);
}

const antrianBaruHandle = () => {
  clearBilling();
  setEditAntrian(false);
}

const clearBilling = () => {
  setNama('');
  setBilling([]);
  setTempBilling([]);
  setCount(0);
  setSubTotal(0);
  setDisk(0);
  setTotal(0);
  setKembali(0);
  setTunai(0);
  setCountAntrian(antrians.length);
}

const questionAntrianHandleEdit = () => {
  console.log(billing.length);
  Swal.fire({
    title: 'Perubahan Akan Disimpan!',
    text: "",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Tidak',
    confirmButtonText: 'Ya!'
  }).then((result) => {
    if (result.isConfirmed) {
      antrianHandleEdit();
      return true;        
    }
  })
}

const questionChargeHandle = () => {
  console.log(billing.length);
  Swal.fire({
    title: 'Konfirmasi Pembayaran!',
    text: "",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Tidak',
    confirmButtonText: 'Ya, Bayar!'
  }).then((result) => {
    if (result.isConfirmed) {
      chargeHandle();
      return true;        
    }
  })
}

const chargeHandle = () => {
  console.log('panjang', billing.length)
  console.log('isi', billing)
  let billings = [];
  

  if(!aktivitas.open){
    // Alert
    console.log('open');
    warning('Toko Belum Buka!');
    return;
  }

  if(editAntrian) {
    if(tempBilling.length == 0 && tempBilling.length < 1){
      warning('Pilih Pesanan!');
      return;
    }
  } else if(billing.length == 0 && billing.length < 1){
    warning('Pilih Pesanan!');
    return;
  }

    console.log('jalan');

    let pes = {
        aktivitas_id: aktivitas.id,
        nama: nama,
        diskon: diskon,
        tunai: tunai
    };

    axios.post(uriPesanan, { pes })
      .then(res => {
        console.log(res);
        console.log(res.data);
        if(editAntrian){
          tempBilling.map(item => {
            billings.push({
                pesanan_id  : res.data.id,
                menu_id     : item.id,
                aktivitas_id: aktivitas.id,
                jumlah      : item.jumlah,
                harga       : item.harga             
            })
          })
        } else {
          billing.map(item => {
            billings.push({
                pesanan_id  : res.data.id,
                menu_id     : item.id,
                aktivitas_id: aktivitas.id,
                jumlah      : item.jumlah,
                harga       : item.harga             
            })
          })
        }
        axios.post(uriDetailPesanan, { billings })
        .then(res => {
          console.log(res);
          console.log(res.data);
          window.open("struk", "_blank");
          success();
          deleteAntrianCharge();
          onChangeTunaiHandle('');
          clearBilling();
        })

      }) 
      .catch(error => {
          danger();
          console.error('There was an error!', error);
      });
}

const addFavorite = (menuId) => {

    axios.post(uriAddFavorite, { menuId })
    .then(response => {
      console.log('add Favorite =>', response.data );
      if(kategoriId){
        menuHandle(kategoriId);
      } else {
        favoriteHandle();
      }

      if(response.data){
        success('Menu Masuk Ke Favorite!');
      } else {
        success('Dihapus di Favorite!');
      }


    })      
}

const onChangeSearch = async (value) => { 
  if(value.length > 0){
    let men = menusSearch.filter(item => {
      return item.nama.toLowerCase().match(value.toLowerCase());
    })
    setViewSearch(true);
    console.log(men.length);
    if(!men.length){
      setSearch([]); 
    } else {
      setSearch(men); 
    }  
  } else {
    setViewSearch(false);
  }
}


return (
<div className="row">
    <div className="col-sm-8 pr-0">
        <header className="topbar" data-navbarbg="skin6">
            <nav className="navbar top-navbar navbar-expand-md default-color">
              <div className="navbar-collapse collapse justify-content-between" id="navbarSupportedContent" data-navbarbg="skin5">
                    <ul className="navbar-nav d-none d-md-block d-lg-none">
                        <li className="nav-item">
                            <a className="nav-toggler nav-link waves-effect waves-light text-white"
                                href="javascript:void(0)"><i className="ti-menu ti-close"></i></a>
                        </li>
                    </ul>
                    
                    
                   <ul className="navbar-nav">
                      <li className="nav-item hidden-sm-downt">
                        <form className="app-search pl-3">
                          <input onChange={(e) => onChangeSearch(e.target.value)} type="text" className="border border-danger form-control" placeholder="Cari Menu..."/> <a
                            className="srh-btn"><i className="ti-search"></i></a>
                        </form>
                      </li>
                    </ul>
                        
                </div>  
            </nav>
        </header>

        <div className=" py-2 pl-5 bg-white shadow mt-2 kategori-group">
          <div className="row">
            <div className="mx-auto pointer item-kategori">          
              <h5 onClick={() => favoriteHandle()} className="text-center my-auto mr-5">FAVORITE</h5>                           
            </div>
            {kategoris.map((item) => 
              <div className="mx-auto pointer item-kategori" onClick={() => menuHandle(item.id)}>
                <h5 className="text-center my-auto mr-5">{item.kategori.toUpperCase()}</h5>        
              </div> 
            )}
          </div>
        </div>
        <div style={{height: '100vh', backgroundColor:' #ecf0f1'}} className="overflow-auto">
          <div className="row pl-3 pr-3 bg-white mt-2 d-flex justify-content-around">
          {
            viewSearch ? 
              search.length 
              ?
                search.map((item) => (<div  className="mt-3 shadow rounded-lg mt-0"  style={{width: '150px', position: 'relative', alignItems: 'center',}}>
                    <div className={`card-text, text-${item.favorite ? 'warning' : 'light'}`} style={{position: 'absolute', top: '5px', right: '5px', fontSize: '20px'}} onClick={() => addFavorite(item.id)} ><i className=" fas fa-star" ></i></div>
                    <div className="" onClick={() => addBilling(item)}>
                       {
                        item.image ?
                        <img src={props.url.url+'/kasir/menu/image/'+item.image} height="150" width="200" className="card-img-top rounded-lg" alt="..." />
                        : 
                        <img src="https://via.placeholder.com/150" height="150" width="200" className="card-img-top rounded-lg" alt="..." />
                       }
                      <div style={{position: 'absolute', bottom: '0px', opacity: '0.8', width: '100%'}} className="text-white text-center bg-dark py-1 rounded-bottom">
                          <div className="card-text text-white text-center" >{item.nama}</div>
                      </div>
                    </div>
                  </div>))
              :
                <h2 className="text-warning mt-4">Tidak Ditemukan!</h2> 
            :
            viewMenu ? menuView : favoriteMenu            
          }
          </div>
        </div>
    </div>



    <div className="col-sm-4 pl-0">   
      <div className="shadow container-fluid bg-white overflow-auto" style={{height: '100vh', backgroundColor:' #ecf0f1'}}>

        <div className="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
             <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Simpan List</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body mx-auto ">
                <input type="text" id="myInput" value={nama} onChange={(e) => setNama(e.target.value)} className="mx-auto form-control border-0 shadow" placeholder="Nama"/>                    
              
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setNama('')}>Batal</button>
                    <button data-dismiss="modal" className="btn default-color text-white" type="button" onClick={() => antrianHandle()}>Simpan</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Daftar Antrian {countAntrian}</h5>
                
                <div className="row">
                    <form className="app-search pl-3 mx-auto">
                      <input type="text" className="form-control" placeholder="Cari..." onChange={(e) => onChangeSearchAntrian(e.target.value)}/> <a
                                className="srh-btn"><i className="ti-search"></i></a>
                    </form>

                </div>
                <button type="button" onClick={() => antrianBaruHandle()} className="btn default-color text-white" data-dismiss="modal">
                  Antrian Baru
                </button>
              </div>
              <div className="modal-body">                                                              
                <table className="table mt-3">
                  <thead>
                    <tr>
                      <th scope="col">Nama Antrian</th>
                      <th scope="col">Waktu</th>
                      <th scope="col">Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                      {
                        antriansSearch.length > 0 ?
                        antriansSearch.map((item, key) => 
                      <tr>
                        <td onClick={() => {pilihAntrianHandle(item);}} data-dismiss="modal"><p className="" >{item.nama}</p></td>
                        <td>{item.waktu}</td>
                        <td><a className="ml-1 px-2 badge badge-danger text-white font-weight-bold" onClick={() => deleteAntrian(item.id)}>X</a></td>
                      </tr>
                          )
                        : 
                        antrians.map((item, key) => 
                      <tr>
                        <td onClick={() => {pilihAntrianHandle(item); }} data-dismiss="modal"><p className="" >{item.nama}</p></td>
                        <td>{item.created_at}</td>
                        <td><a className="ml-1 px-2 badge badge-danger text-white font-weight-bold" onClick={() => deleteAntrian(item.id)}>X</a></td>
                      </tr>
                        )
                      }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>   

        <div className="row p-4 align-middle mb-4">
             <button onClick={() => getAntrian()} type="button" className="default-color px-2 py-1 btn shadow rounded mr-3"  data-toggle="modal" data-target=".bd-example-modal-lg"><i className="ti-menu ti-close font-weight-bold text-white"></i></button>
            <h4 className="text-center my-auto">Pesanan</h4>
        </div>
        <div className="d-flex justify-content-around">
          <p className="font-weight-bold"  style={{fontSize: '16px'}}>
            {nama ?? ''}
          </p>
          <p className="font-weight-bold d-none" >{count ? `${count} Pesanan` : ''}</p>
        </div>
        
        <div className="mb-5">

          <table className="table table-borderless">


          {
            billing.map((item, key) => 
            <tr className="p-0" key={key}>
              <td className="p-0 pb-2 pr-2">{item.nama}</td>
              <td className="p-0 pb-2 row justify-content-between mr-3">
                <span className="px-2 mr-1 badge badge-danger text-white font-weight-bold" onClick={() => actionBilling(item, false)}>-</span> x {item.jumlah} <span className="text-white ml-1 badge badge-success px-2 font-weight-bold" onClick={() => actionBilling(item, true)}>+</span>                
              </td>
              <td className="p-0 pb-2 ">
                    <div className="row mr-1 justify-content-between">
                    <div className="text-left">Rp {formatRupiah(item.harga)}</div>
                    <span className="ml-1 px-2 badge badge-danger text-white font-weight-bold text-right" onClick={() => deleteBilling(key, item.jumlah)}>X</span>
                    </div>                                      
              </td>
            </tr>) 
          }

          </table>
          <hr />
          <table className="table table-borderless">
              <tr className="font-weight-bold">
                  <td className="p-1  pl-5">Subtotal</td>
                  <td className="pl-5 p-1">Rp {formatRupiah(subTotal)}</td>
              </tr>
              <tr className="font-weight-bold">
                  <td className="p-1  pl-5">Diskon</td>
                  <td className="pl-5 p-1">Rp {formatRupiah(disk)}</td>
              </tr>
              <tr className="font-weight-bold">
                  <td className="p-1  pl-5">Total</td>
                  <td className="pl-5 p-1">Rp {formatRupiah(total)}</td>
              </tr>
          </table> 
        </div>

        <div className="mt-5 mb-3" style={{bottom: 0}}>
          <div className="col-10 mx-auto">
            <input type="number" name="tunai" className="shadow mx-auto form-control mb-4" placeholder="Tunai" onChange={(e) => onChangeTunaiHandle(e.target.value)}/>
          </div>
                
          <table className="table table-borderless text-left">
              <tr className={`font-weight-bold, text-left, ${kembali < 0 ? 'text-warning font-weight-bold' : 'font-weight-bold text-left'}`}>
                  <td className="p-0 pl-5">
                    
                     Kembali {kembali < 0 ? <i className=" fas fa-exclamation-triangle"></i> : ''}
                    
                   </td> 
                  <td className="pl-5 p-0">Rp {formatRupiah(kembali)}</td>
              </tr>
              <tr className="font-weight-bold">
                  <td className="p-0 pl-5">
                      Diskon   
                  </td>
                  <td className="pl-5">
                      <div className="row">
                          <div className="mr-3 pl-2">
                            <select onChange={(e) => onChangeDiskon(e.target.value)} className="custom-select custom-select-sm">
                              <option selected value="0">Pilih Diskon</option>
                              {
                                diskons.map(item => 
                                  <option value={item.diskon}>{item.event}</option>
                                )
                              }
                            </select> 
                          </div>                              
                      </div>
                      
                      
                  </td>
              </tr>
          </table>
          <div className="d-flex justify-content-center mx-auto">
          {
            editAntrian ? 
            <a className="btn btn-danger mr-3" onClick={ () => questionAntrianHandleEdit() } >Simpan</a>
            :
            <a className="btn btn-danger mr-3" data-target=".bd-example-modal-sm" data-toggle="modal" >Simpan</a>
          }
              <button type="button" className="btn btn-danger ml-3" onClick={() => questionChargeHandle()}>Bayar</button>
          </div>
        </div>
      </div>


      
    </div>

</div>
  );
}

export default Billing;
if (document.getElementById('billing')) {
    let url = document.getElementById('url');
    const propsUrl = Object.assign({}, url.dataset);
    ReactDOM.render(<Billing url={propsUrl} />, document.getElementById('billing'));
}

$(document).ready(function() {
  $('.bd-example-modal-sm').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus');
  });
});