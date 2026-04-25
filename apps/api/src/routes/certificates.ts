import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { issueCertificate } from '../services/certGen';
import { Certificate } from '../db/models/certificate';
import { HttpError } from '../middleware/errorHandler';

export const certificatesRouter = Router();

certificatesRouter.post('/issue/:courseId', requireAuth, async (req, res, next) => {
  try {
    const cert = await issueCertificate(req.user!.sub, req.params.courseId);
    res.status(201).json({
      certificate: {
        id: cert._id.toString(),
        verificationId: cert.verificationId,
        userName: cert.userName,
        courseTitle: cert.courseTitle,
        skills: cert.skills,
        issuedAt: cert.issuedAt,
      },
    });
  } catch (e) {
    next(e);
  }
});

certificatesRouter.get('/verify/:verificationId', async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({ verificationId: req.params.verificationId });
    if (!cert) throw new HttpError(404, 'not_found');
    res.json({
      certificate: {
        verificationId: cert.verificationId,
        userName: cert.userName,
        courseTitle: cert.courseTitle,
        skills: cert.skills,
        issuedAt: cert.issuedAt,
      },
    });
  } catch (e) {
    next(e);
  }
});
