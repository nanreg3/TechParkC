using Microsoft.Extensions.WebEncoders.Testing;
using System;

namespace TechParkC.Model
{
    public class Cliente
    {
        public int ID { get; set; }                                 // posicao 0
        public string Nome { get; set; }                            // posicao 1
        public string Celular { get; set; }                         // posicao 2
        public string Status { get; set; }                          // posicao 3

        public string Placa { get; set; }                           // posicao 4
        public string Cor { get; set; }                             // posicao 5
        public string Modelo { get; set; }                          // posicao 6
        public string Fabricante { get; set; }                      // posicao 7

        public double? Valor { get; set; }                           // posicao 8
        public DateTime? InicioPeriodo { get; set; }                 // posicao 9
        public DateTime? FimPeriodo { get; set; }                    // posicao 10
        public int? Avisos { get; set; }                             // posicao 11

    }
}
