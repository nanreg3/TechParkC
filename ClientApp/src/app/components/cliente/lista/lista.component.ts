import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClienteService } from '../../../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  constructor(
    private clienteService: ClienteService,
    private router: Router,
  ) {}

  clientes: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['nome', 'vencimento'];
 
  ngOnInit() {
    this.getClientes();
  }

  getClientes() {
    this.clienteService.getClientes().subscribe(
      (x: any) => {
        console.log(x);
        this.clientes = new MatTableDataSource(x);
      },
      (e) => { console.error(e) }
    ).add(() => {
    this.clientes.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: string) {
    this.clientes.filter = filterValue.trim().toLowerCase();
  }

  public rotaDetalhes(id): void {
      this.router.navigate([`/cadastro/${id}`]);
  }

}
