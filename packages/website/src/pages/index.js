import * as React from "react";
// import { StaticImage } from "gatsby-plugin-image";
import Layout, { Section, SectionTitle, CardWithDescription, CardWithTitle } from "../components/Layout";
import SEO from "../components/seo";
import HeroStartPage from "../components/HeroStartPage";
import CommunitySection from "../components/CommunitySection";
import Uploader from "../components/Uploader";
import {
  ArrowRight,
  SkynetToolBig,
  SkynetUserBig,
  SkynetPowerBig,
  SkynetMonetizationSmall,
  SkynetPersistenceSmall,
  SkynetSpeedSmall,
  SkynetUsageSmall,
  SkynetSiaSmall,
} from "../components/Icons";

const LearnMoreButton = () => (
  <a
    href="https://secure.siasky.net"
    className="inline-block border-2 border-palette-600 text-palette-600 px-10 leading-10 rounded-full text-xs uppercase text-center mt-7"
  >
    Learn more
  </a>
);

const etosCards = [
  {
    Icon: SkynetToolBig,
    title: "Build a freer future",
  },
  {
    Icon: SkynetUserBig,
    title: "Fight corporate control of user data",
  },
  {
    Icon: SkynetPowerBig,
    title: "Empower global citizens",
  },
];

const ecosystemCards = [
  {
    Icon: SkynetUsageSmall,
    title: "Easy to use",
    text:
      "Decentralized storage without needing to run a node or wallet. Skynet also includes SDKs for popular programming languages and APIs that integrate seamlessly with your existing apps.",
  },
  {
    Icon: SkynetSpeedSmall,
    title: "Fast",
    text:
      "Skynet's speeds rival centralized providers and surpass all decentralized offerings. A typical Skynet download starts in under 500 ms and can stream at rates as high as 1 Gbps!",
  },
  {
    Icon: SkynetSiaSmall,
    title: "Free to use",
    text:
      "Focus on building, not overheard server costs. When users own their data, developers aren't asked to pay for it.",
  },
  {
    Icon: SkynetMonetizationSmall,
    title: "Monetization",
    text:
      "Profit directly from the success of your skapp. Now you can truly prioritize your users, instead of advertisers.",
  },
  {
    Icon: SkynetPersistenceSmall,
    title: "Persistence",
    text:
      "Your skapp and data stay live, even if corporations pull your access to their resources. You can also use Skynet as a failover site for when centralized providers go down.",
  },
];

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />

      <Section>
        <HeroStartPage />
      </Section>

      <div className="px-8 py-16 relative">
        <div className="max-w-content mx-auto">
          <div className="absolute inset-x-0 bg-white bottom-0" style={{ top: "240px" }}></div>
          <Uploader />
        </div>
      </div>

      <Section className="bg-white">
        <SectionTitle className="text-center mb-11">The new decentralized internet is here</SectionTitle>

        <div className="grid grid-cols-1 gap-8 desktop:grid-cols-3">
          {etosCards.map((card, index) => (
            <CardWithTitle key={index} {...card} />
          ))}
        </div>

        <div className="flex flex-col items-center mt-16">
          <p className="max-w-screen-md text-center text-base font-content text-palette-400">
            Skynet apps pave the way for a new web that priorities the privacy, security, and experience of users. Join
            our decentralized ecosystem and revolution.
          </p>

          <a href="/" className="mt-6 uppercase flex items-center text-xs text-palette-600">
            Try Skynet Apps <ArrowRight />
          </a>
        </div>
      </Section>

      <Section className="bg-palette-100">
        <SectionTitle className="mb-7 desktop:hidden">Ready to build your application?</SectionTitle>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 desktop:grid-cols-3">
          <div className="hidden desktop:inline-block">
            <SectionTitle>Ready to build your application?</SectionTitle>

            <LearnMoreButton />
          </div>

          {ecosystemCards.map((card, index) => (
            <CardWithDescription key={index} {...card} />
          ))}
        </div>

        <div className="desktop:hidden mt-12 text-center">
          <LearnMoreButton />
        </div>
      </Section>

      <Section className="bg-primary">
        <CommunitySection />
      </Section>

      {/* <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <StaticImage
      src="../images/gatsby-astronaut.png"
      width={300}
      quality={95}
      formats={["AUTO", "WEBP", "AVIF"]}
      alt="A Gatsby astronaut"
      style={{ marginBottom: `1.45rem` }}
    />
    <p>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </p> */}
    </Layout>
  );
};

export default IndexPage;