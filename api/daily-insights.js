import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const {
      date,
      location,
      weather,
      activities,
      travel,
      children,
      notes,
      tomorrow
    } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
אתה מנוע תובנות יומיות עבור אפליקציית טיולים משפחתית.
המטרה: להחזיר רק תובנות ענייניות ורלוונטיות ליום הקרוב, מבוססות על הנתונים הבאים.

הנתונים להיום:
תאריך: ${date}
מיקום: ${location}
מזג אוויר: ${JSON.stringify(weather)}
פעילויות היום: ${JSON.stringify(activities)}
נסיעות: ${JSON.stringify(travel)}
ילדים: ${JSON.stringify(children)}
הערות כלליות: ${JSON.stringify(notes)}

הנתונים למחר:
${JSON.stringify(tomorrow)}

הנחיות:
1. בחר רק תובנות שבאמת רלוונטיות ליום — לא חובה מכל קטגוריה.
2. כל תובנה תהיה עניינית, מקצועית, תכליתית.
3. כל תובנה יכולה להיות פסקה אחת או שתיים.
4. אל תכתוב רשימות. רק טקסט רציף.
5. כתוב בעברית בלבד.
6. כל תובנה צריכה להיות עצמאית וברורה.
7. אל תשתמש בטון רגשי מדי — ענייני, אבל אנושי.

קטגוריות אפשריות (לבחירה דינמית בלבד):
- מזג אוויר והשפעה על היום
- נסיעות, עומסים ותזמון
- פעילות פיזית ומסלולים
- דינמיקה משפחתית וילדים
- הזדמנויות מיוחדות בדרך
- מיינדסט של טיול (בטון ענייני)
- בטיחות ופרקטיקה

החזר 2–5 תובנות, כל אחת בפסקה אחת או שתיים.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6
    });

    const insights = completion.choices[0].message.content;

    res.status(200).json({
      date,
      insights
    });

  } catch (error) {
    console.error("Daily Insights API Error:", error);
    res.status(500).json({
      error: "Failed to generate insights"
    });
  }
}
