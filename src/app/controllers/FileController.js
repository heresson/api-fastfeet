import File from '../models/File';

class FileController {
  async store(req, res) {
    // pega o valor de originalname vindo do arquivo e coloca na variavel local name
    // pega o valor de filename vindo do arquivo e coloca na variavel local path
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    return res.json(file);
  }
}
export default new FileController();
