import { TG_BOT_TOKEN, TG_CHAT_IDS } from '../constants/config';

export const sendTelegramMessage = async (text) => {
    if (!TG_BOT_TOKEN || TG_BOT_TOKEN.includes("YOUR_TELEGRAM")) return;
    try {
        await Promise.all(TG_CHAT_IDS.map(chatId => 
            fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
            })
        ));
    } catch (e) {
        console.error("Telegram Error:", e);
    }
};