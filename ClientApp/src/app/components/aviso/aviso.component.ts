import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { AppSettingsService } from '../../services/appSettings.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.css']
})
export class AvisoComponent implements OnInit {

  constructor(
    private clienteService: ClienteService,
    private appSettingsService: AppSettingsService,
    private router: Router,
  ) { }

  Vencidos: Cliente[] = [];
  VenceHoje: Cliente[] = [];
  Proximos: Cliente[] = [];
  public pix = "";

  ngOnInit() {
    this.getVencidos();
    this.getConfiguracoes();
  }

  getVencidos() {
    this.clienteService.getClientesVencidos().subscribe(
      (x: any) => {
        console.log(x);
        this.Vencidos = x;
      },
      (e) => { console.error(e) }
    ).add(() => {
      this.setDiasAtraso();
      this.getVenceHoje();
    })
  }
  setDiasAtraso() {
    var hoje = new Date()
    for (var i = 0; i < this.Vencidos.length; i++) {
      var ultimoPag = new Date(this.Vencidos[i].fimPeriodo);
      var atrasoEmMs = hoje.getTime() - ultimoPag.getTime();
      this.Vencidos[i].atrasoEmDias = Math.floor(atrasoEmMs / (1000 * 60 * 60 * 24));
    }
  }

  getVenceHoje() {
    this.clienteService.getClientesVenceHoje().subscribe(
      (x: any) => {
        console.log(x);
        this.VenceHoje = x;
      },
      (e) => { console.error(e) }
    ).add(() => {
      this.getProximos();
    })
  }

  getProximos() {
    this.clienteService.getClientesProximos().subscribe(
      (x: any) => {
        console.log(x);
        this.Proximos = x;
      },
      (e) => { console.error(e) }
    ).add(() => {
      this.setDiasRestantes();
    })
  }
  setDiasRestantes() {
    var hoje = new Date()
    for (var i = 0; i < this.Proximos.length; i++) {
      var ultimoPag = new Date(this.Proximos[i].fimPeriodo);
      var restanteEmMs = ultimoPag.getTime() - hoje.getTime();
      this.Proximos[i].diasRestantes = Math.floor(restanteEmMs / (1000 * 60 * 60 * 24) + 1);
    }
  }

  enviarAviso(id : number, numero : string, nome : string, atraso? : number, hoje? : boolean, faltam? : number ) {
    this.addAviso(id);
    var primeiroNome = nome.split(' ');
    var msg = "Olá " + primeiroNome[0] + ", tudo bem com você? Estou passando para lembrar do pagamento mensal do estacionamento.";

    if (atraso > 0) {
      msg = msg + " Já se passaram " + atraso + " dias do vencimento.";
    }
    else if (hoje) {
      msg = msg + " Hoje é o dia do vencimento.";
    }
    else if (faltam) {
      msg = msg + " Faltam " + faltam + " dias para o vencimento.";
    }

    msg = msg + " Segue chave do pix : " + this.pix;

    window.open(`https://api.whatsapp.com/send?phone=55${numero}&text=${msg}`, '_blank').focus;
  }

  getConfiguracoes() {
    this.appSettingsService.get().subscribe(
      (x: any) => {
        this.pix = x.pix;
      },
      (e) => {
        console.error("Erro ao tentar buscar as configuracoes do appSettings.", e);
      }
    )
  }

  pagou(id, nome) {
    if (confirm("Confirma o pagamento do(a) " + nome + " ?")) {
      console.log("pagamento confirmado.");
      this.atualizarPagamento(id);
    }
    else {
      console.log("pagamento cancelado.");
    }
  }

  addAviso(id) {
    this.clienteService.getCliente(id).subscribe(
      (x: Cliente) => {
        var cliente = x;
        cliente.avisos++;
        this.clienteService.put(cliente).subscribe(
          () => {
            console.log('Aviso add!');
          },
          () => {
            console.error('Erro ao tentar add os avisos!');
          }
        ).add(() => {
          this.getVencidos();
        });
      }
    )
  }
  
  atualizarPagamento(id) {
    this.clienteService.getCliente(id).subscribe(
      (x: Cliente) => {
        var cliente = x;

        var ano = Number(cliente.fimPeriodo.toString().substring(0, 4));
        var mes = Number(cliente.fimPeriodo.toString().substring(5, 7));
        var dia = Number(cliente.fimPeriodo.toString().substring(8, 10));

        cliente.inicioPeriodo = new Date(ano, mes - 1, dia);
        cliente.fimPeriodo = new Date(ano, mes, dia);
        cliente.avisos = 0;

        this.clienteService.put(cliente).subscribe(
          () => {
            console.log('Pagamento atualizado!');
          },
          () => {
            console.error('Erro ao tentar atualizar o pagamento!');
          }
        ).add(() => {
          this.getVencidos();
        });
      }
    )
  }

  public rotaDetalhes(id): void {
    this.router.navigate([`/cadastro/${id}`]);
  }

}
