import React from 'react';

export default function DocumentacaoAPI() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 className='text-4xl font-bold mb-6'>Instruções de uso da API</h1>
      <p>
        Bem-vindo a página de instruções de uso da nossa API de dados atuariais e demográficos. 
        Para acessar os endpoints abaixo, você precisa de um <strong>Token de Acesso</strong> válido,  podendo ser solicitado na página <a href="/solicitar-token" className='text-blue-500 font-medium hover:underline'>Solicitar Token</a>.
      </p>

      <hr style={{ margin: '20px 0' }} />

      <h2 className='text-2xl font-semibold mb-4'>🔒 Como Autenticar (Bearer Token)</h2>
      <p>
        Todas as requisições devem incluir o seu token no cabeçalho (Header) <code>Authorization</code>, 
        utilizando o formato <strong>Bearer</strong>. 
      </p>
      
      <div style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }} className='mt-4'>
        <strong>Formato do Cabeçalho:</strong>
        <pre style={{ margin: '10px 0 0 0' }}>Authorization: Bearer SEU_TOKEN_AQUI</pre>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h2 className='text-2xl font-semibold mb-4'>📍 Endpoints Disponíveis</h2>
      <p>A URL base da API é: <code>{'https://backend-weld-five-44.vercel.app'}</code></p>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <strong><span style={{ color: 'green' }}>[GET]</span> /original</strong>
          <p style={{ margin: '5px 0 0 0', color: '#555' }}>Retorna os dados da tábua original.</p>
        </li>
        <li style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <strong><span style={{ color: 'green' }}>[GET]</span> /previsoes</strong>
          <p style={{ margin: '5px 0 0 0', color: '#555' }}>Retorna a tábua de projeções processadas.</p>
        </li>
        <li style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <strong><span style={{ color: 'green' }}>[GET]</span> /metricas</strong>
          <p style={{ margin: '5px 0 0 0', color: '#555' }}>Fornece as métricas de erro das simulações.</p>
        </li>
        <li style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <strong><span style={{ color: 'green' }}>[GET]</span> /nacoes_unidas</strong>
          <p style={{ margin: '5px 0 0 0', color: '#555' }}>Acessa a base de dados demográficos das Nações Unidas.</p>
        </li>
      </ul>

      <hr style={{ margin: '20px 0' }} />

      <h2 className='text-2xl font-bold'>💻 Exemplos de Uso</h2>
      
      <h3 className='mt-6 text-xl font-semibold mb-4'>JavaScript (Fetch API)</h3>
      <pre style={{ backgroundColor: '#2d2d2d', color: '#ccc', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
{`const token = "SEU_TOKEN_RECEBIDO_POR_EMAIL";

fetch("https://backend-weld-five-44.vercel.app/previsoes", {
  method: "GET",
  headers: {
    "Authorization": \`Bearer \${token}\`,
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Erro:", error));`}
      </pre>

      <h3 className='mt-6 text-xl font-semibold mb-4'>Python (Requests)</h3>
      <pre style={{ backgroundColor: '#2d2d2d', color: '#ccc', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
{`import requests

url = "https://backend-weld-five-44.vercel.app/previsoes"
token = "SEU_TOKEN_RECEBIDO_POR_EMAIL"

headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.get(url, headers=headers)
print(response.json())`}
      </pre>

    </div>
  );
}