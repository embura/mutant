# mutant

# Instalação Docker
link https://docs.docker.com/install/

# Executar na API
`docker-compose -f "docker-compose.yml" up -d --build` <br>
`docker-compose up`

# API
- Node 12.2
- Elasticsearch 6.7.2

http://localhost:3000/users

# logs
http://localhost:9200/mutant/_search?q=name:mutant

