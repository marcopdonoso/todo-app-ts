import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from 'mongoose'
import { compareOTPWithItsHash, generateHashOTP } from '../helpers/hashOTP'
import { jwtForApp } from '../helpers/jwtForApp'
import { jwtOTPHash } from '../helpers/jwtOTPHash'
import {
  generateOTP,
  generateSendOTPTemplate,
  mailTransport
} from '../helpers/mailVerify'
import UserModel from '../models/user'
import { type IUser, type JwtOtpVerificationResponse } from '../types/user'

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user data from request body
    const userData: IUser = req.body

    // Check if user already exists in the database
    const userExists = await UserModel.findOne({
      userEmail: userData.userEmail
    })
    if (userExists === null) {
      const newUser = new UserModel(userData)
      await newUser.save()
    }

    // Generate a new OTP and send it via email
    const OTP = generateOTP()
    mailTransport(
      'Necesita ingresar este OTP para usar la APP',
      userData.userEmail,
      generateSendOTPTemplate(OTP)
    )

    // Generate a hash of the OTP and create a JWT containing the hash
    const hashOTP = generateHashOTP(OTP)
    const tokenOTP = await jwtOTPHash(hashOTP)

    // Return a success response with the user's email and the token containing the OTP
    res.status(201).json({
      message: 'Usuario creado/OTP entregado con éxito',
      user: userData.userEmail,
      success: true,
      token: tokenOTP
    })
  } catch (error) {
    // Return an error response if user creation fails
    res.status(500).json({ msg: 'No se pudo crear el usuario', success: false })
  }
}

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user ID, OTP, and token from request body
    const userId: string = req.body.userId
    const otp: string = req.body.otp
    const token: string = req.body.token

    // Validate user ID and OTP
    if (userId === '' || otp.trim().length === 0) {
      res.status(401).json({ msg: 'Solicitud inválida', success: false })
    }

    if (!isValidObjectId(userId)) {
      res.status(401).json({ msg: 'userId inválido', success: false })
    }

    // Check if user exists in the database
    const user = await UserModel.findById(userId)
    if (user === null) {
      res.status(401).json({ msg: 'Usuario no encontrado', success: false })
    }

    // Validate the OTP using the token containing its hash
    const { otpHash } = jwt.verify(
      token,
      process.env.SECRET_KEY_OTP_JWT as string
    ) as JwtOtpVerificationResponse

    const isMatched = compareOTPWithItsHash(otp, otpHash)
    if (!isMatched) {
      res.status(401).json({ msg: 'Token inválido', success: false })
    }

    // Generate a token for app access and return it with user ID and email
    if (user !== null) {
      const appToken = await jwtForApp(userId, user?.userEmail)
      res.status(201).json({
        userId,
        userEmail: user?.userEmail,
        token: appToken
      })
    }
  } catch (error) {
    // Return an error response if the verification of the email fails
    res.status(500).json({ msg: 'No se pudo validar el email', success: false })
  }
}

export { createUser, verifyEmail }
