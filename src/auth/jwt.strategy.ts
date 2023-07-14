import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  isEmailConfirmed: boolean;
  roles: any;
}

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyGh6/VgT/x/UFj+q2XCc\n8767Qs7tjrj8v3Lw+h52HjJsxTiGOyDPi+S0pcM36syVa3Vndnu3j1fvF7or7AW4\nUf3ZDM7IKQxeMgz/lUx2V0x43dk3eB8lCUMX1H3krFTERjpJrhGbmREOEP6M2aqr\njSW8sLY85yXw17w+CzIDJIUDs73i8NOKFvDfgjKyjpww60QMaLYk+MRqrRL9OOuz\nWg2Uehj226QHhhElRDICEHCux9myAp2FYx90tax7yUiMnAhy6VR1KYVf6RXs9mCg\nIPzA1LUwbvLZzVoObdKsXKsFzvfgEdfxOKI65dJR88m5ro9BrjMS3A9Q63vdR3vT\nIewWim139Pp3U3vLJ4HoHgyg1AMm4w6G80klzl/J9+25qumY9TM1xJMTWht0UHrT\nA8aAXQdL3ZIp0rTd5MXGArQoBs0XOla2aALsCBjodDhN7DOEKwE0o4N0WOWjm4ch\nwIlAEunGXfZbm8OfP2aBmSCDvmmfacZyW/GzrKRz1dAf0haXAnNn8RaaeLXmbsIG\nPcs6FjDpcSsuK4fn0Uv+1Lel1vyaJc4YmW+aHrvtIrzHzZeuxzlnbOcDFmvj3Zrv\nPEbIVDqqJM4pLDMtimj0ZpNzX5eQS/vic+j4jywv07wlSEsLR3ygI/fQ7nnUxnPQ\nU1DKje8TyKaL2/5x3J4hE00CAwEAAQ==\n-----END PUBLIC KEY-----`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    return { claims: payload };
  }
}
