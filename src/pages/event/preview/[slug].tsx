import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { BiTimeFive } from "react-icons/bi";
import { BsTelephone } from "react-icons/bs";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import {
  IoCashOutline,
  IoInformationOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";

import EventDetails from "~/components/general/event/eventDetails";
import EventRegistration from "~/components/general/event/eventRegistration";
import { CONSTANT } from "~/constants";
import { env } from "~/env";
import { EventByIdDocument } from "~/generated/generated";

const Page = () => {
  const router = useRouter();

  const { data, loading } = useQuery(EventByIdDocument, {
    variables: {
      id: router.query.slug as string,
    },
  });

  const event =
    data?.eventById.__typename === "QueryEventByIdSuccess"
      ? data.eventById.data
      : null;
  const error =
    data?.eventById.__typename === "Error" ? data.eventById.message : null;

  const getEventAttributes = () => {
    if (!event) return [];
    let teamSizeText = "",
      eventTypeText = "";
    if (event.minTeamSize === event.maxTeamSize) {
      teamSizeText += event.minTeamSize;
      if (event.minTeamSize === 1) {
        teamSizeText += " member";
      } else teamSizeText += " members";
    } else {
      teamSizeText = ` ${event.minTeamSize} - ${event.maxTeamSize}`;
    }

    if (event.eventType.includes("MULTIPLE")) {
      eventTypeText =
        event.eventType.split("_")[0]![0] +
        event.eventType.split("_")[0]!.slice(1).toLowerCase() +
        " Event (Multiple Entry)";
    } else
      eventTypeText =
        event.eventType[0] + event.eventType.slice(1).toLowerCase() + " Event";

    return [
      {
        name: "Venue",
        text: event.venue,
        Icon: IoLocationOutline,
      },
      {
        name: "Event Type",
        text: eventTypeText,
        Icon: IoPersonOutline,
      },
      {
        name: "Fees",
        text: event?.id==="50" ? 60 : event?.id ==="52" ? 500: event?.id==="53" ? 250 : event?.id==="54" ? 200 : event?.id==="55" ? 150 : event?.id==="56" ? 300 : event?.fees,
        Icon: IoCashOutline,
      },
      {
        name: "Team Size",
        text: teamSizeText,
        Icon: IoPeopleOutline,
      },
      {
        name: "Maximum Teams",
        text: event.maxTeams,
        Icon: IoInformationOutline,
      },
    ];
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`relative flex items-center justify-center`}>
      <Image
        alt="events-bg"
        src={CONSTANT.ASSETS.PUBLIC.EVENT_BG}
        height={1920}
        width={1080}
        priority
        className={`absolute left-0 top-0 h-screen w-screen object-cover object-center`}
      />
      <Toaster />
      {event ? (
        <section
          className={`no-scrollbar mx-auto flex h-screen max-w-7xl flex-col gap-5 overflow-y-scroll text-white lg:flex-row lg:overflow-y-hidden`}
        >
          <div
            className={`lg:no-scrollbar overflow-x-visible px-3 pt-20 lg:h-full lg:overflow-y-scroll lg:pb-8`}
          >
            <div
              className={`basis-1/3 rounded-xl border border-[#D79128] bg-[#054432] bg-opacity-70 p-5 backdrop-blur-xl backdrop-filter`}
            >
              <div className={`grow-0 space-y-4 rounded-md sm:space-y-10`}>
                {event.image && (
                  <Image
                    src={event.image}
                    className={`relative z-10 w-full rounded-t-md sm:rounded-md`}
                    alt={event.name}
                    width={1000}
                    height={1000}
                  />
                )}
                <h1
                  className={`px-4 pb-0 text-center font-life-craft text-4xl tracking-wider sm:p-0 md:text-6xl text-[#D79128]`}
                >
                  {event.name}
                </h1>
                <div className={`sm:p-0 sm:px-4 sm:pb-4`}>
                  <EventDetails details={event.description ?? ""} />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`lg:no-scrollbar flex w-full shrink-0 basis-1/3 flex-col items-center gap-5 rounded-md px-3 pb-8 lg:h-full lg:overflow-y-scroll lg:pt-20`}
          >
            <div
              className={`w-full rounded-xl border border-[#D79128] bg-[#054432] bg-opacity-70 p-5 backdrop-blur-xl backdrop-filter`}
            >
              <div>
                <div className={`order-2 w-full space-y-1.5`}>
                  {/* <hr className="w-48 h-1 mx-auto my-4 bg-secondary-800 border-0 rounded " /> */}
                  <h2
                    className={`mb-2 text-2xl font-bold tracking-wider text-[#D79128] md:text-4xl`}
                  >
                    Details
                  </h2>
                  <div className={`mt-2 flex w-full flex-wrap gap-2`}>
                    {getEventAttributes().map((attr, idx) =>
                      attr.text ? (
                        <div
                          key={idx}
                          className={`md:text-md flex w-full items-center gap-2 rounded-full border border-secondary-400/40 bg-[#D79128] bg-opacity-30 p-1.5 px-2 text-left text-sm`}
                        >
                          {
                            <attr.Icon className="bg-[#D79128] rounded-3xl h-full text-4xl  p-1 text-[#002C1B]" />
                          }
                          <p>
                            {attr.name} {": "}
                          </p>
                          <p className={`leading-4`}>{attr.text}</p>
                        </div>
                      ) : (
                        <></>
                      ),
                    )}
                  </div>
                  <div className={`text-sm`}>
                    <div className={`grid grid-cols-1 gap-2`}>
                      {event.rounds.map((round, idx) => (
                        <div
                          key={idx}
                          className={`items-center space-y-2 rounded-xl border border-[#D79128] bg-[#D79128] bg-opacity-30 px-3 py-2 text-white`}
                        >
                          <div className={`font-semibold`}>
                            Round {round.roundNo}
                          </div>
                          <div className={`space-y-2`}>
                            <p
                              className={`flex items-center gap-2`}
                              suppressHydrationWarning
                            >
                              <span className="h-full rounded-full bg-[#D79128] p-2 text-xl text-[#002C1B]">
                                <BsFillCalendar2WeekFill />
                              </span>
                              {round.date
                                ? new Date(round.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )
                                : ""}
                            </p>
                            <p
                              className={`flex items-center gap-2`}
                              suppressHydrationWarning
                            >
                              <span className="h-full rounded-full bg-[#D79128] p-2 text-xl text-[#002C1B]">
                                <BiTimeFive />
                              </span>
                              {round.date
                                ? new Date(round.date).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  },
                                )
                                : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`order-1 mt-3 flex w-full justify-center`}>
                  {event.name.toLowerCase() !== "lazzerena" ? ( //todo -> check the event name and id in db
                    <EventRegistration
                      fees={event.fees}
                      eventId={event.id}
                      type={event.eventType}
                    />
                  ) : (
                    <div
                      className={`rounded-sm p-2.5 px-3 font-semibold italic text-[#D79128]`}
                    >
                      On-spot registrations only
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`w-full rounded-xl border border-[#D79128] bg-[#054432] bg-opacity-70 p-5 backdrop-blur-xl backdrop-filter`}
            >
              <div className={``}>
                <div className={`order-3 w-full`}>
                  <h2 className={`mb-2 text-2xl tracking-wider md:text-4xl`}>
                    Organizers
                  </h2>
                  <div className={`w-full space-y-2`}>
                    {event.organizers.map((organizer, idx) => (
                      <div
                        key={idx}
                        className={`text-md w-full rounded-xl border border-[#D79128] bg-[#D79128] bg-opacity-30 p-3 text-white`}
                      >
                        <h3 className={`mb-2 text-lg font-semibold`}>
                          {organizer.user.name}
                        </h3>
                        <div className={`flex flex-col gap-2`}>
                          {organizer.user.email && (
                            <a
                              href={`mailto:${organizer.user.email}`}
                              className={`inline-flex items-center gap-2 overflow-x-auto text-sm hover:underline hover:underline-offset-4`}
                            >
                              <span className="h-full rounded-full bg-[#D79128] p-2 text-xl text-[#002C1B]">
                                <MdOutlineMailOutline className={`text-lg`} />{" "}
                              </span>
                              {organizer.user.email}
                            </a>
                          )}
                          {organizer.user.phoneNumber && (
                            <a
                              href={`tel:${organizer.user.phoneNumber}`}
                              className={`inline-flex items-center gap-2 text-sm hover:underline hover:underline-offset-4`}
                            >
                              {" "}
                              <span className="h-full rounded-full bg-[#D79128] p-2 text-xl text-[#002C1B]">
                                <BsTelephone className={`text-lg`} />{" "}
                              </span>
                              {organizer.user.phoneNumber}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div
          className={`absolute inset-0 flex h-screen flex-col items-center justify-center gap-5 p-10 text-white`}
        >
          <h1 className={`text-3xl font-semibold`}>Oops!</h1>
          <div className={`text-center`}>
            <p>
              Looks like you&apos;ve glitched out and got lost in the pixels!
            </p>
            <p>
              Click{" "}
              <Link className={`underline`} href={"/events"}>
                here
              </Link>{" "}
              to head back to the events page
            </p>
          </div>
          <p
            className={`rounded-md bg-red-200 px-4 py-2 text-center text-red-800`}
          >
            <b>Error message:</b> {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
