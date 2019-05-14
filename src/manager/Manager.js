import React from 'react';
import axios from 'axios';

export class Manager extends React.Component {
    state = {
        orders: [],
        shutters: [],
        formSelectedPreset: '',
        formDate: '',
        formPrice: ''
    };

    componentDidMount() {
        this.fetchShutters();
        this.fetchOrders();
    }

    fetchOrders() {
        axios.get('http://localhost/api/customer/orders').then(resp => {
            this.setState({
                orders: resp.data
            });
        });
    }

    fetchShutters() {
        axios.get('http://localhost/api/shutters').then(resp => {
            this.setState({
                shutters: resp.data
            });
        });
    }

    onClickStatusInstall = (i) => {
        const status = 'Install';
        let orders = [...this.state.orders];
        orders[i].status = status;

        axios.post('http://localhost/api/worker/orders/' + orders[i]._id + '/update-status', {
            status: orders[i].status
        }).then((response) => {
            this.setState({
                orders: orders
            });
        });

    };

    onClickStatusFinished = (i) => {
        const status = 'Finished';
        let orders = [...this.state.orders];
        orders[i].status = status;

        axios.post('http://localhost/api/worker/orders/' + orders[i]._id + '/update-status', {
            status: orders[i].status
        }).then((response) => {
            this.setState({
                orders: orders
            });
        });

    };

    onDateChange = (event) => {
        this.setState({
            formSelectedPreset: '',
            formDate: event.target.value
        });
    };

    onClickStatusDate = (i) => {
        const installationDate = this.state.formDate;
        let orders = [...this.state.orders];
        orders[i].installationDate = installationDate;

        axios.post('http://localhost/api/manager/orders/' + orders[i]._id + '/update-installationDate', {
            installationDate: orders[i].installationDate
        }).then((response) => {
            this.setState({
                orders: orders
            });
        });

    };
    onClickStatusPaid = (i) => {
        const status = 'Paid';
        let orders = [...this.state.orders];
        orders[i].status = status;

        axios.post('http://localhost/api/worker/orders/' + orders[i]._id + '/update-status', {
            status: orders[i].status
        }).then((response) => {
            this.setState({
                orders: orders
            });
        });

    };

    onPriceChange = (event) => {
        this.setState({
            formSelectedPreset: '',
            formPrice: event.target.value
        });
    };

    onClickStatusPrice = (i) => {
        const price = this.state.formPrice;
        let orders = [...this.state.orders];
        orders[i].price = price;

        axios.post('http://localhost/api/manager/orders/' + orders[i]._id + '/update-price', {
            price: orders[i].price
        }).then((response) => {
            this.setState({
                orders: orders
            });
        });

    };



    render() {
        return (
            <div className="manager-wrapper">
                <h2 className="p-3 mb-2 bg-danger">Tevékenyégek</h2>
                <table className="table table-condensed table-striped">
                    <thead>
                    <tr>
                        <th>Azonosító</th>
                        <th>Méretek</th>
                        <th>Háló</th>
                        <th>Szín</th>
                        <th>Beszerelés</th>
                        <th>Ár</th>
                        <th>Státusz</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.orders.map((value, i) => {
                        return (
                            <tr key={i}>
                                <td>{value._id}</td>
                                <td>{value.shutter ? value.shutter.width : ''} x {value.shutter ? value.shutter.height : ''}</td>
                                <td>{value.shutterNet ? 'Igen' : 'Nem'}</td>
                                <td>{value.shutterColor}</td>
                                <td>{value.installationDate}</td>
                                <td>{value.price}</td>
                                <td>{value.status}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <h2 className="p-3 mb-2 bg-success">Függő rendelések</h2>
                <table className="table table-condensed table-striped">
                    <thead>
                    <tr>
                        <th>Azonosító</th>
                        <th>Méretek</th>
                        <th>Háló</th>
                        <th>Szín</th>
                        <th>Árajánlat</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.orders.map((value, i) => {
                        if (value.status === "pending") return (
                            <tr key={i}>
                                <td>{value._id}</td>
                                <td>{value.shutter ? value.shutter.width : ''} x {value.shutter ? value.shutter.height : ''}</td>
                                <td>{value.shutterNet ? 'Igen' : 'Nem'}</td>
                                <td>{value.shutterColor}</td>
                                <td>{value.price}</td>
                                <td>
                                    <input onChange={this.onPriceChange} value={this.state.formPrice}
                                           type="number"
                                           className="form-control"/>
                                </td>
                                <td>
                                    <button className="btn btn-warning"
                                            onClick={() => this.onClickStatusPrice(i)}>Beáraz
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-md-6">
                        <h2 className="p-3 mb-2 bg-primary">Folyamatban lévő munkák</h2>
                        <div className="table-responsive">
                            <table className="table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <th>Azonosító</th>
                                    <th>Méret</th>
                                    <th>Szúnyogháló</th>
                                    <th>Szín</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.orders.map((value, i) => {
                                    if (value.status === "progress") return (
                                        <tr key={i}>
                                            <td>{value._id}</td>
                                            <td>{value.shutter ? value.shutter.width : ''} x {value.shutter ? value.shutter.height : ''}</td>
                                            <td>{value.shutterNet ? 'Igen' : 'Nem'}</td>
                                            <td>{value.shutterColor}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2 className="p-3 mb-2 bg-info">Kész munkák</h2>
                        <div className="table-responsive">
                            <table className="table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <th>Azonosító</th>
                                    <th>Méret</th>
                                    <th>Háló</th>
                                    <th>Szín</th>
                                    <th>Beszerelés</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.orders.map((value, i) => {
                                    if (value.status === "done") return (
                                        <tr key={i}>
                                            <td>{value._id}</td>
                                            <td>{value.shutter ? value.shutter.width : ''} x {value.shutter ? value.shutter.height : ''}</td>
                                            <td>{value.shutterNet ? 'Igen' : 'Nem'}</td>
                                            <td>{value.shutterColor}</td>

                                            <td>
                                                <button className="btn btn-info"
                                                        onClick={() => this.onClickStatusInstall(i)}>Elfogad
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <h2 className="p-3 mb-2 bg-warning">Beszerelés irányítása</h2>
                        <div className="table-responsive">
                            <table className="table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <th>Azonosító</th>
                                    <th>Méret</th>
                                    <th>Szúnyogháló</th>
                                    <th>Szín</th>
                                    <th>Dátum</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.orders.map((value, i) => {
                                    if (value.status === "Install") return (
                                        <tr key={i}>
                                            <td>{value._id}</td>
                                            <td>{value.shutter ? value.shutter.width : ''} x {value.shutter ? value.shutter.height : ''}</td>
                                            <td>{value.shutterNet ? 'Igen' : 'Nem'}</td>
                                            <td>{value.shutterColor}</td>
                                            <td>{value.installationDate}</td>
                                            <td>
                                                <input onChange={this.onDateChange} value={this.state.formDate}
                                                       type="date"
                                                       className="form-control"/>
                                            </td>
                                            <td>
                                                <button className="btn btn-warning"
                                                        onClick={() => this.onClickStatusDate(i)}>Dátum
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-success"
                                                        onClick={() => this.onClickStatusFinished(i)}>Lezár
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <h2 className="p-3 mb-2 bg-success">Lezárt rendelések</h2>
                        <table className="table table-condensed table-striped">
                            <thead>
                            <tr>
                                <th>Azonosító</th>
                                <th>Méretek</th>
                                <th>Háló</th>
                                <th>Szín</th>
                                <th>Beszerelés</th>
                                <th>Ár</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.orders.map((value, i) => {
                                if (value.status === "Finished" || value.status === 'Paid') return (
                                    <tr key={i}>
                                        <td>{value._id}</td>
                                        <td>{value.shutter ? value.shutter.width : ''} x {value.shutter ? value.shutter.height : ''}</td>
                                        <td>{value.shutterNet ? 'Igen' : 'Nem'}</td>
                                        <td>{value.shutterColor}</td>
                                        <td>{value.installationDate}</td>
                                        <td>{value.price}</td>
                                        <td>
                                            {value.status !== 'Paid'
                                                ?
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => this.onClickStatusPaid(i)}
                                                >Fizetve</button>
                                                :
                                                null
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        )
    }
}