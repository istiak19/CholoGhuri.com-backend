/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import passport from "passport";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        }, async (email: string, password: string, done) => {
            try {
                const isExist = await User.findOne({ email });
                if (!isExist) {
                    // return done(null, false, { message: "User does not exist" })
                    return done("User does not exist");
                };

                const isGoogleAuthenticated = isExist.auths.some(providerObjects => providerObjects.provider == "google");
                
                if (isGoogleAuthenticated && !isExist.password) {
                    // return done(null, false, { message: "You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings." })
                    return done("You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings.")
                };

                const isMatchPassword = await bcrypt.compare(
                    password as string,
                    isExist.password as string
                );

                if (!isMatchPassword) {
                    // return done(null, false, { message: "Incorrect password" })
                    return done("Incorrect password")
                };

                return done(null, isExist);
            } catch (error) {
                done(error);
            }
        }));

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile?.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "Not email found" });
                };

                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email,
                        picture: profile.photos?.[0].value,
                        role: "USER",
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                };

                return done(null, user);
            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error);
            }
        }
    ));

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});