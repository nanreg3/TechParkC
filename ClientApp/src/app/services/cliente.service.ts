import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private http : HttpClient,
  ) { }

  getClientes() {
    return this.http.get('api/clientes');
  }

  getClientesVencidos() {
    return this.http.get('api/clientes/Vencidos');
  }

  getClientesVenceHoje() {
    return this.http.get('api/clientes/VenceHoje');
  }

  getClientesProximos() {
    return this.http.get('api/clientes/Proximos');
  }

  getCliente(id) {
    return this.http.get(`api/clientes/${id}`);
  }

  post(cliente) {
    return this.http.post(`api/clientes`, cliente);
  }

  put(cliente) {
    return this.http.post(`api/clientes/Alterar/${cliente.id}`, cliente);
  }

  postClientes(clientes) {
    return this.http.post(`api/clientes/Lista`, clientes);
  }

  deleteCliente(id) {
    return this.http.delete(`api/clientes/${id}`);
  }

  deleteClientes() {
    return this.http.delete(`api/clientes/All`);
  }

}
