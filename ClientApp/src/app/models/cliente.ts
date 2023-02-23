export class Cliente {
  public id : number;
  public nome : string;
  public celular : string;
  public status: string;

  public placa : string;
  public cor : string;
  public modelo : string;
  public fabricante: string;

  public valor : number;
  public inicioPeriodo : Date;
  public fimPeriodo : Date;
  public avisos: number;

  public atrasoEmDias?: number;
  public diasRestantes?: number;
}
