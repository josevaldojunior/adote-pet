-- Criar a tabela animal
CREATE TABLE adote.animal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    url_imagem VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    status ENUM('DISPONIVEL', 'ADOTADO') NOT NULL
);

-- Popular a tabela animal com dados de exemplo
INSERT INTO adote.animal (nome, descricao, url_imagem, categoria, data_nascimento, status) VALUES
('Rex', 'Cachorro amigável e brincalhão', 'http://example.com/rex.jpg', 'Cachorro', '2020-01-01', 'DISPONIVEL'),
('Miau', 'Gato calmo e carinhoso', 'http://example.com/miau.jpg', 'Gato', '2019-06-15', 'ADOTADO'),
('Bolt', 'Cachorro enérgico e leal', 'http://example.com/bolt.jpg', 'Cachorro', '2021-03-20', 'DISPONIVEL'),
('Luna', 'Gata curiosa e brincalhona', 'http://example.com/luna.jpg', 'Gato', '2018-02-25', 'DISPONIVEL'),
('Toby', 'Cachorro dócil e obediente', 'http://example.com/toby.jpg', 'Cachorro', '2017-11-13', 'DISPONIVEL'),
('Nina', 'Gata tímida mas carinhosa', 'http://example.com/nina.jpg', 'Gato', '2016-08-09', 'ADOTADO'),
('Lola', 'Gata independente e ativa', 'http://example.com/lola.jpg', 'Gato', '2015-04-05', 'DISPONIVEL'),
('Simba', 'Gato curioso e brincalhão', 'http://example.com/simba.jpg', 'Gato', '2017-03-14', 'DISPONIVEL'),
('Bella', 'Gata carinhosa e brincalhona', 'http://example.com/bella.jpg', 'Gato', '2020-11-29', 'ADOTADO'),
('Coco', 'Gata esperta e brincalhona', 'http://example.com/coco.jpg', 'Gato', '2020-06-21', 'DISPONIVEL');

