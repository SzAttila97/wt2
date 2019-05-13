import React from 'react';
import axios from 'axios';

export class Worker extends React.Component {
    state = {
        orders: [],
        shutters: [],
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


    onClickStatusPending = (i) => {
        const status = 'progress';
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

    onClickStatusDone = (i) => {
        const status = 'done';
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
            <div className="worker-wrapper">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Rendelések</h2>
                        <div className="table-responsive">
                        <table className="table table-condensed table-striped">
                            <thead>
                            <tr>
                                <th>Rendelési azonosító</th>
                                <th>Elvállal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.orders.map((value, i) => {
                                if (value.status === "ordered") return (
                                    <tr key={i}>
                                        <td>{value._id}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => this.onClickStatusPending(i)}>Elvállal</button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2>Munkáim</h2>
                        <div className="table-responsive">
                        <table className="table table-condensed table-striped">
                            <thead>
                            <tr>
                                <th>Azonosító</th>
                                <th>Méret</th>
                                <th>Szúnyogháló</th>
                                <th>Szín</th>
                                <th>Kész</th>
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
                                        <td>
                                            <button className="btn btn-danger" onClick={() => this.onClickStatusDone(i)}>Kész</button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}