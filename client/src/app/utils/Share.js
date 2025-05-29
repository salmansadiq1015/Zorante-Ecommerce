"use client";
import React from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WeiboShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
} from "react-share";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../content/authContent";

export default function ShareData({ url, title, setShowShare }) {
  const { auth } = useAuth();
  return (
    <div className="w-[21rem] relative sm:w-[35rem] py-4 px-4 rounded-md bg-white dark:bg-gray-800 border shadow  overflow-hidden ">
      <span
        className="absolute top-2 right-3 cursor-pointer"
        onClick={() => setShowShare(false)}
      >
        <IoClose className="h-6 w-6 cursor-pointer " />
      </span>
      <div className="w-full flex flex-col gap-2 pb-5">
        <div className="flex items-center gap-1">
          <div className="w-[2.8rem] h-[2.8rem] sm:w-[3.2rem] sm:h-[3.2rem]">
            <div className="relative w-[2.7rem] h-[2.7rem] sm:w-[3rem] sm:h-[3rem] bg-white dark:bg-gray-800 rounded-full border-2 border-orange-600 overflow-hidden z-20">
              <Image
                src={
                  auth && auth?.user?.avatar
                    ? auth?.user?.avatar
                    : "/profile.png"
                }
                alt="Profile"
                layout="fill"
                className="rounded-lg"
              />
            </div>
          </div>
          <h3 className="text-[16px] font-semibold">{auth?.user?.name}</h3>
        </div>
        <h1 className="text-[18px] font-semibold ">Share to</h1>
      </div>
      <div className="flex w-full overflow-auto items-center gap-4 shidden ">
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon
            size={36}
            round
            className="shadow-md hover:shadow-lg rounded-full"
          />
        </WhatsappShareButton>
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={36} round />
        </FacebookShareButton>
        <LinkedinShareButton url={url} title={title}>
          <LinkedinIcon size={36} round />
        </LinkedinShareButton>
        <InstapaperShareButton url={url}>
          <InstapaperIcon size={36} round />
        </InstapaperShareButton>
        <EmailShareButton url={url} subject={title} body="Check this out!">
          <EmailIcon size={36} round />
        </EmailShareButton>
        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={36} round />
        </TelegramShareButton>
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={36} round />
        </TwitterShareButton>
        <GabShareButton url={url} title={title}>
          <GabIcon size={36} round />
        </GabShareButton>
        <HatenaShareButton url={url}>
          <HatenaIcon size={36} round />
        </HatenaShareButton>

        <LineShareButton url={url} title={title}>
          <LineIcon size={36} round />
        </LineShareButton>

        <LivejournalShareButton url={url}>
          <LivejournalIcon size={36} round />
        </LivejournalShareButton>
        <MailruShareButton url={url} title={title}>
          <MailruIcon size={36} round />
        </MailruShareButton>
        <OKShareButton url={url} title={title}>
          <OKIcon size={36} round />
        </OKShareButton>
        <PocketShareButton url={url} title={title}>
          <PocketIcon size={36} round />
        </PocketShareButton>
        <RedditShareButton url={url} title={title}>
          <RedditIcon size={36} round />
        </RedditShareButton>

        <TumblrShareButton url={url} title={title}>
          <TumblrIcon size={36} round />
        </TumblrShareButton>

        <ViberShareButton url={url}>
          <ViberIcon size={36} round />
        </ViberShareButton>
        <VKShareButton url={url} title={title}>
          <VKIcon size={36} round />
        </VKShareButton>
        <WeiboShareButton url={url} title={title}>
          <WeiboIcon size={36} round />
        </WeiboShareButton>

        <WorkplaceShareButton url={url} quote={title}>
          <WorkplaceIcon size={36} round />
        </WorkplaceShareButton>
      </div>
    </div>
  );
}
