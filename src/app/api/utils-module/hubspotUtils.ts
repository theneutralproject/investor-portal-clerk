export type HubspotContact = {
  properties: { property: string; value: string }[];
  email: string;
};

export async function createOrUpdateContact(hubspotContact: HubspotContact) {
    const signupDate = new Date(new Date().setUTCHours(0, 0, 0, 0))
      .getTime()
      .toString();
    hubspotContact.properties.push({
      property: "date_signed_up",
      value: signupDate,
    });

    await fetch(
      `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${hubspotContact.email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(hubspotContact),
      }
    ).catch((err) => {
      console.log("hubspot post error", err);
      // eslint-disable-next-line
      return new Response(JSON.stringify({ error: err }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    });
    console.log("hubspot success");
    return new Response(JSON.stringify(
      { message: "success" }), {
      headers: { "Content-Type": "application/json" },
    });
  }