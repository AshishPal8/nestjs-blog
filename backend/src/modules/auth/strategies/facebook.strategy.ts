import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get("FACEBOOK_APP_ID"),
      clientSecret: configService.get("FACEBOOK_APP_SECRET"),
      callbackURL: configService.get("FACEBOOK_CALLBACK_URL"),
      scope: ["email"],
      profileFields: ["emails", "name", "photos"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { id, emails, name, photos } = profile;

    const user = {
      provider: "facebook",
      facebookId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      avatar: photos[0]?.value,
    };

    done(null, user);
  }
}
