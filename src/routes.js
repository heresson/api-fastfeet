import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import MyDeliveriesController from './app/controllers/MyDeliveriesController';
import MyDeliveredController from './app/controllers/MyDeliveredController';
import WithdrawDeliveryController from './app/controllers/WithdrawDeliveryController';
import FinishDeliveryController from './app/controllers/FinishDeliveryController';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  return res.json({ hello: 'world' });
});
routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', MyDeliveriesController.index);
routes.get('/deliveryman/:id/delivered', MyDeliveredController.index);
routes.put(
  '/deliveryman/:deliverymanId/withdraw/:deliveryId',
  WithdrawDeliveryController.update
);
routes.put(
  '/deliveryman/:deliverymanId/finish/:deliveryId',
  FinishDeliveryController.update
);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

export default routes;
