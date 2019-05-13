import React from 'react';
import axios from 'axios';

export class Customer extends React.Component {
    state = {
        orders: [],
        shutters: [],
        formWidth: '',
        formHeight: '',
        formColor: 'Fehér',
        formSelectedPreset: '',
        formNet: 0
    };

    constructor() {
        super();

        this.onColorChange = this.onColorChange.bind(this);
    }

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

    onSizeChange = (event) => {
        const val = event.target.value;
        this.setState({
            formSelectedPreset: event.target.value,
        });
        if (val) {
            const [width, height] = val.split('x');
            this.setState({
                formWidth: width,
                formHeight: height
            });
        }
    };

    onHeightChange = (event) => {
        this.setState({
            formSelectedPreset: '',
            formHeight: event.target.value
        });
    };

    onWidthChange = (event) => {
        this.setState({
            formSelectedPreset: '',
            formWidth: event.target.value
        });
    };

    onColorChange(event) {
        this.setState({
            formColor: event.target.value
        });
    }
    onNetChange = (event) => {
        this.setState({
            formNet: event.target.value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        if(!this.state.formWidth || !this.state.formHeight || !this.state.formColor) {
            alert('Hiányzó adat!');
            return;
        }

        axios.post('http://localhost/api/customer/orders', {
            width: parseInt(this.state.formWidth),
            height: parseInt(this.state.formHeight),
            color: this.state.formColor,
            isNet: this.state.formNet
        }).then((resp) => {
            console.log(resp);
            this.fetchOrders();
            this.fetchShutters();
        });
    };

    onClickStatusOrdered = (i) => {
        const status = 'ordered';
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

    onClickStatusDelted = (i) => {
        const status = 'deleted';
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

    render() {
        return (
            <div className="customer-wrapper">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Kosár</h2>
                        <div className="table-responsive">
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
                                            {value.price ? <button className="btn btn-success" onClick={() => this.onClickStatusOrdered(i)}>Véglegesítés</button> : ''}
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => this.onClickStatusDelted(i)}>Törlés</button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        </div>
                        <h2>Elkészült rendelések</h2>
                        <div className="table-responsive">
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
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2>Új rendelés</h2>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Redőny típusok</label>
                                <select onChange={this.onSizeChange} value={this.state.formSelectedPreset}
                                        className="form-control" name="" id="">
                                    <option value="">Egyedi méret</option>
                                    {this.state.shutters.map((val, i) => {
                                        return <option key={i}
                                                       value={val.width + 'x' + val.height}>{val.width} x {val.height}</option>
                                    })};
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Magasság</label>
                                <input onChange={this.onHeightChange} value={this.state.formHeight} type="number"
                                       className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label>Szélesség</label>
                                <input onChange={this.onWidthChange} value={this.state.formWidth} type="number"
                                       className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label>Szín</label>
                                <select onChange={this.onColorChange} name="" id="" value={this.state.formColor}
                                        className="form-control">
                                    <option value="Fehér">Fehér</option>
                                    <option value="Fekete">Fekete</option>
                                    <option value="Barna">Barna</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Háló</label>
                                <select onChange={this.onNetChange} name="" id="" value={this.state.formNet}
                                        className="form-control">
                                    <option value="1">Igen</option>
                                    <option value="0">Nem</option>
                                </select>
                            </div>

                            <button className="btn btn-primary">Kosárhoz adás</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}