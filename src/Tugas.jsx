import React from "react"
import "./App.css"
import Axios from "axios";
import { Modal, ModalHeader, ModalBody } from "reactstrap"

const API_URL = `http://localhost:8080`;

class Tugas extends React.Component {
    state = {
        dataProduk: [],
        selectedFile: null,
        formProduct: {
            productName: "",
            keterangan: "",
            id: 0
        },
        openModal: false,
        formEdit: {
            productName: "",
            keterangan: "",
            photoProduct: "",
            id:0
        }
    }

    componentDidMount() {
        this.readData()
    }

    inputHandler = (e, key) => {
        const { value } = e.target;
        this.setState({
            formProduct: {
                ...this.state.formProduct, [key]: value
            }
        });
    };
    inputEditHandler = (e, key) => {
        const { value } = e.target;
        this.setState({
            formEdit: {
                ...this.state.formEdit, [key]: value
            }
        });
    };

    editBtnHandler = (idx) => {
        this.setState({
            formEdit: {
                ...this.state.dataProduk[idx],
            },
            openModal: true,
        });
    };

    cancleHandler = () => {
        this.setState({
            openModal: false
        })
    }

    readData = () => {
        Axios.get(`${API_URL}/products/readProduct`)
            .then((res) => {
                console.log(res);
                this.setState({
                    dataProduk: res.data
                })

            })
            .catch((err) => {
                console.log(err);
            })
    }

    fileChangeHandler = (e) => {
        this.setState({ selectedFile: e.target.files[0] });
    };

    createProductHandler = () => {
        let formData = new FormData();

        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        formData.append("productData", JSON.stringify(this.state.formProduct));

        Axios.post(`${API_URL}/products/createProduct`, formData)
            .then((res) => {
                { this.readData() }
            })
            .catch((err) => {
                console.log("ERROR");
                console.log(err);
            });

        console.log(this.state.formProduct);
        console.log(JSON.stringify(this.state.formProduct));
    }

    deleteProductHandler = (id) => {
        Axios.delete(`${API_URL}/products/delete/${id}`)
            .then((res) => {
                console.log(res);
                { this.readData() }

            })
            .catch((err) => {
                console.log(err);

            })

    }

    editProductHandler = () => {
        let formData = new FormData();

        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        formData.append("productData", JSON.stringify(this.state.formEdit));
        Axios.put(
          `${API_URL}/products/editProduct/${this.state.formEdit.id}`,
          formData
        )
          .then((res) => {
              alert("berhasil hore")
            // swal("Success!", "Your item has been edited", "success");
            this.setState({ openModal: false });
            this.readData();
          })
          .catch((err) => {
              alert("yah belum perbaiki lagi ")
            // swal("Error!", "Your item could not be edited", "error");
            console.log(err);
          });
      };


    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    renderTbody = () => {
        const { dataProduk } = this.state
        return dataProduk.map((val, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td> <img style={{ width: "100%" }} src={val.photoProduct} alt="" /></td>
                    <td>{val.productName}</td>
                    <td>{val.keterangan}</td>
                    <td>
                        <td><input type="button" value="Edit" onClick={() => this.editBtnHandler(index)} /></td>
                        <td><input type="button" value="Delete" onClick={() => this.deleteProductHandler(val.id)} /></td>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <div className="mt-4 d-flex flex-column justify-content-center align-items-center">
                            <h4>Buat Produk Baru</h4>
                            <input className="mt-2" type="text" placeholder="Nama Produk" onChange={(e) => this.inputHandler(e, "productName")} />
                            <input className="mt-2" type="text" placeholder="Keterangan" onChange={(e) => this.inputHandler(e, "keterangan")} />
                            <p className="mt-3">Upload gambar</p>
                            <input className="mt-2" type="file" onChange={this.fileChangeHandler} />
                            <input className="mt-4" type="button" value="Tambah Produk" onClick={this.createProductHandler} />
                        </div>
                    </div>
                    <div className="col-8 ml-4">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h1 className="mt-4">DAFTAR PRODUK</h1>
                            <div className="mt-4">
                                <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>No</th>
                                            <th>Foto Produk</th>
                                            <th>Nama Produk</th>
                                            <th>Keterangan</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTbody()}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.openModal}
                >
                    <ModalHeader
                        toggle={this.toggleModal}
                    >
                        <caption>Edit</caption>

                    </ModalHeader>
                    <ModalBody>
                        <div className="mt-4 d-flex flex-column justify-content-center align-items-center">
                            <input type="text"
                                placeholder="Nama Produk"
                                value={this.state.formEdit.productName}
                                onChange={(e)=>this.inputEditHandler(e, "productName")}
                            />
                            <input className="mt-2"
                                type="text"
                                placeholder="keterangan"
                                value={this.state.formEdit.keterangan}
                                onChange={(e)=>this.inputEditHandler(e, "keterangan")}
                            />
                            <div className="mt-2">
                                <center>
                                    <img style={{ width: "50%" }} src={this.state.formEdit.photoProduct} alt="" />
                                </center>
                            </div>
                            <input className="mt-2" type="file" onChange={this.fileChangeHandler} />
                        </div>
                        <center>
                            <input className="mt-4" type="button" value="Simpan" onClick={this.editProductHandler} />
                            <input className="ml-3" type="button" value="tidak jadi" onClick={this.cancleHandler} />
                        </center>
                    </ModalBody>
                </Modal>

            </div>
        )
    }
}

export default Tugas