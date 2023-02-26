import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  constructor(
    private clienteService: ClienteService,
    private router: ActivatedRoute,
    private routerNavigate: Router,
  ) {
  }

  ano = new Date().getFullYear();
  mes = new Date().getMonth();
  dia = new Date().getDate();

  cliente: Cliente = {
    id: 0,
    nome: "",
    celular: "",
    status: "1",
    placa: "",
    cor: "",
    modelo: "",
    fabricante: "",
    inicioPeriodo: new Date(this.ano, this.mes, this.dia),
    fimPeriodo: new Date(this.ano, this.mes + 1, this.dia),
    valor: 0,
    avisos: 0
  }

  public estadoSalvar = 'post';

  ngOnInit() {
    this.carregarCliente();
  }

  salvar() {
    !this.cliente.avisos ? this.cliente.avisos = 0 : null;
    this.cliente.nome = this.cliente.nome.toUpperCase();
    this.cliente.placa = this.cliente.placa.toUpperCase();
    this.clienteService[this.estadoSalvar](this.cliente).subscribe(
      (x) => {
        console.log(x);
      },
      (e) => {
        console.error(e);
      },
    ).add(() => {
        this.routerNavigate.navigate([`lista`]);
    })
  }

  excluir() {
    if (confirm("Deseja realmente EXCLUIR esse cliente?")) {
      this.clienteService.deleteCliente(this.cliente.id).subscribe(
        (x) => {
          console.log(x);
        },
        (e) => {
          console.error(e);
        },
      ).add(() => {
        this.routerNavigate.navigate([`lista`]);
      })
    }
  }

  //carrega a pessoa pelo paramentro;id/pin que chegou na url da pagina:
  public carregarCliente(): void {
    const idParam = this.router.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.estadoSalvar = 'put';
      this.clienteService.getCliente(idParam).subscribe(
        (x: Cliente) => {
          //this.spinner.show();
          this.cliente = { ...x };
        },
        (e) => {
          console.error(e);
          //this.toastr.error('Erro ao carregar Pessoa.', 'Erro!');
          //this.spinner.hide();
        },
        () => {
          //this.spinner.hide();
        }
      )
    }

  }


}
