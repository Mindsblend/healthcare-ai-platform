SELECT 
  current_database() as database_name,
  inet_server_addr() as host,
  inet_server_port() as port,
  version() as pg_version;