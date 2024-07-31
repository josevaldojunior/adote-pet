-- Criar a tabela categoria
CREATE TABLE adote.categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Popular a tabela categoria com dados de exemplo
INSERT INTO adote.categoria (nome) VALUES
('Cachorro'),
('Gato');

-- Criar a tabela animal com referência à categoria
CREATE TABLE adote.animal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    url_imagem VARCHAR(255) NOT NULL,
    categoria_id BIGINT NOT NULL,
    data_nascimento DATE NOT NULL,
    status ENUM('DISPONIVEL', 'ADOTADO') NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES adote.categoria(id)
);

-- Popular a tabela animal com dados de exemplo
INSERT INTO adote.animal (nome, descricao, url_imagem, categoria_id, data_nascimento, status) VALUES
('Rex', 'Cachorro amigável e brincalhão', 'http://example.com/rex.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Cachorro'), '2020-01-01', 'DISPONIVEL'),
('Miau', 'Gato calmo e carinhoso', 'http://example.com/miau.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Gato'), '2019-06-15', 'ADOTADO'),
('Bolt', 'Cachorro enérgico e leal', 'http://example.com/bolt.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Cachorro'), '2021-03-20', 'DISPONIVEL'),
('Luna', 'Gata curiosa e brincalhona', 'http://example.com/luna.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Gato'), '2018-02-25', 'DISPONIVEL'),
('Toby', 'Cachorro dócil e obediente', 'http://example.com/toby.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Cachorro'), '2017-11-13', 'DISPONIVEL'),
('Nina', 'Gata tímida mas carinhosa', 'http://example.com/nina.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Gato'), '2016-08-09', 'ADOTADO'),
('Lola', 'Gata independente e ativa', 'http://example.com/lola.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Gato'), '2015-04-05', 'DISPONIVEL'),
('Simba', 'Gato curioso e brincalhão', 'http://example.com/simba.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Gato'), '2017-03-14', 'DISPONIVEL'),
('Bella', 'Gata carinhosa e brincalhona', 'http://example.com/bella.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Gato'), '2020-11-29', 'ADOTADO'),
('Coco', 'Gata esperta e brincalhona', 'http://example.com/coco.jpg', (SELECT id FROM adote.categoria WHERE nome = 'Gato'), '2020-06-21', 'DISPONIVEL');
