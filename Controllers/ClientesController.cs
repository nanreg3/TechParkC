using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using TechParkC.Model;

namespace TechParkC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppSettings appSettings;
        public ClientesController(IOptionsSnapshot<AppSettings> options)
        {
            appSettings = options.Value;
        }

        [HttpGet("Lista")]
        public List<Cliente> GetListaOrdenada()
        {
            string path = appSettings.diretorioDados;

            List<Cliente> clientes = new();
            using (FileStream fs = new(path, FileMode.Open))
            {
                using (StreamReader sr = new(fs))
                {
                    while (!sr.EndOfStream)
                    {
                        var linha = sr.ReadLine();

                        var cliente = formatarStringParaCliente(linha);

                        clientes.Add(cliente);
                    }

                    return clientes
                        .OrderBy(x => x.Nome)
                        .ToList();
                }
            };
        }

        [HttpGet]
        public List<Cliente> Get()
        {
            string path = appSettings.diretorioDados;

            List<Cliente> clientes = new();
            using (FileStream fs = new(path, FileMode.Open))
            {
                using (StreamReader sr = new(fs))
                {
                    while (!sr.EndOfStream)
                    {
                        var linha = sr.ReadLine();

                        var cliente = formatarStringParaCliente(linha);

                        clientes.Add(cliente);
                    }

                    return clientes.ToList();
                }
            };
        }

        [HttpGet("Vencidos")]
        public List<Cliente> GetListaVencidos()
        {
            List<Cliente> clientes = new();

            clientes = Get()
                .Where(
                c => c.FimPeriodo?.Date < DateTime.Now.Date
                && c.Status == "1")
                .OrderBy(c => c.Avisos)
                .ToList();

            return clientes;
        }

        [HttpGet("VenceHoje")]
        public List<Cliente> GetListaVenceHoje()
        {
            List<Cliente> clientes = new();

            clientes = Get()
                .Where(
                c => c.FimPeriodo?.Date == DateTime.Now.Date
                && c.Status == "1")
                .OrderBy(c => c.Avisos)
                .ToList();

            return clientes;
        }

        [HttpGet("Proximos")]
        public List<Cliente> GetListaProximos()
        {
            int quantidadeDiaAviso = appSettings.quantidadeDiaAviso;

            List<Cliente> clientes = new();

            clientes = Get()
                .Where(
                c => c.FimPeriodo?.Date <= DateTime.Now.AddDays(quantidadeDiaAviso).Date
                && c.FimPeriodo?.Date > DateTime.Now.Date
                && c.Status == "1"
                )
                .OrderBy(c => c.Avisos)
                .ToList();

            return clientes;
        }

        [HttpGet("{id}")]
        public Cliente Get(int id)
        {
            List<Cliente> clientes = new();

            clientes = Get();

            Cliente cliente = new();

            cliente = clientes.Where(c => c.ID == id).FirstOrDefault();

            return cliente;
        }

        [HttpPost]
        public string Post([FromBody] Cliente cliente)
        {
            string path = appSettings.diretorioDados;

            cliente.ID = Get().Count() + 1;

            string novaLinha = formatarClienteParaString(cliente);

            using (FileStream fs = new FileStream(path, FileMode.Append))
            {
                using (StreamWriter sw = new StreamWriter(fs))
                {
                    sw.WriteLine(novaLinha);

                    return "Nova linha : " + novaLinha;
                }
            };
        }

        [HttpPost("Lista")]
        public string PostArray([FromBody] List<Cliente> clientes)
        {
            string path = appSettings.diretorioDados;

            try
            {
                List<string> novasLinhas = new();
                var i = 1;
                foreach (Cliente cliente in clientes)
                {
                    cliente.ID = i;
                    novasLinhas.Add(formatarClienteParaString(cliente));
                    i++;
                }

                using (FileStream fs = new FileStream(path, FileMode.Append))
                {
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        foreach (var item in novasLinhas)
                        {
                            sw.WriteLine(item);
                        }

                        return "ok";
                    }
                };
            }
            catch (IOException e)
            {
                return e.Message;
            }
        }

        [HttpPost("Alterar")]
        public string Alterar([FromBody] Cliente cliente)
        {
            if (cliente == null)
            {
                return "Erro : As informações do cliente informado são nulas";
            }

            try
            {
                Delete(cliente.ID);

                Post(cliente);

                return "ok";
            }
            catch (IOException e)
            {
                return e.Message;
            }
        }

        [HttpDelete("{Id}")]
        public string Delete(int Id)
        {
            try
            {
                List<Cliente> clientes = Get();

                List<Cliente> ClientesRestantes = new();

                foreach (Cliente item in clientes)
                {
                    if (item.ID != Id)
                    {
                        ClientesRestantes.Add(item);
                    }
                }

                DeleteAll();

                PostArray(ClientesRestantes);

                return "ok";
            }
            catch (IOException e)
            {
                return e.Message;
            }
        }

        [HttpDelete("All")]
        public string DeleteAll()
        {
            string path = appSettings.diretorioDados;

            try
            {
                using (FileStream fs = new FileStream(path, FileMode.Truncate))
                {
                    return "ok";
                };
            }
            catch (IOException e)
            {
                return e.Message;
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("formatarClienteParaString")]

        public string formatarClienteParaString(Cliente cliente)
        {
            return
            cliente.ID
            + ";" + cliente.Nome
            + ";" + cliente.Celular
            + ";" + cliente.Status

            + ";" + cliente.Placa
            + ";" + cliente.Cor
            + ";" + cliente.Modelo
            + ";" + cliente.Fabricante

            + ";" + cliente.Valor
            + ";" + cliente.InicioPeriodo
            + ";" + cliente.FimPeriodo
            + ";" + cliente.Avisos
            ;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("formatarStringParaCliente")]
        public Cliente formatarStringParaCliente(string linha)
        {
            var valores = linha.Split(';');
            Cliente cliente = new();

            cliente.ID = int.Parse(valores[0]);
            cliente.Nome = valores[1];
            cliente.Celular = valores[2];
            cliente.Status = valores[3];

            cliente.Placa = valores[4];
            cliente.Cor = valores[5];
            cliente.Modelo = valores[6];
            cliente.Fabricante = valores[7];

            cliente.Valor = Double.Parse(valores[8]);
            cliente.InicioPeriodo = DateTime.Parse(valores[9]).Date;
            cliente.FimPeriodo = DateTime.Parse(valores[10]).Date;
            cliente.Avisos = int.Parse(valores[11]);

            return cliente;
        }
    }
}
