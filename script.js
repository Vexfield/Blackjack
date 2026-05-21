let final_bet = 1;
let random_hit = 0;
let dealer_random_hit = 0;
let balance = 100;
let settings_are_open;
let bet_label, money_label, current_value_label, value_func_label, outcome_label, hit_button,
    warning_label, start_button, double_button, split_button, surrender_button, dealer_current_value_label, dealer_current_value,
    dealer_value_func_label, stand_button, bet_buttons,
    hit1,hit2,dealer_hit1,dealer_hit2, settings, settings_button, popup, surr_yes, surr_no, mute, music_range, sfx_range, deck;
let turn;
let suit = ["spades","clubs","hearts","diamonds"]
let previous_hit = [];
let prev_music_vol;
let prev_sfx_vol;
let doubled;
let card_back;
let game_ended;
let animating = false;

const music = {

}
const sfx = {
    hit: new Audio("card_hit.mp3")
};

window.onload = function() {
    const $ = id => document.getElementById(id);
    bet_label = $("bet");
    money_label = $("money");
    outcome_label = $("outcome");
    hit_button = $("btn-hit");
    warning_label = $("warning");
    start_button = $("btn-start")
    stand_button = $("btn-stand");
    // split_button =$("btn-split");
    double_button = $("btn-double");
    surrender_button = $("btn-surrender");
    value_func_label = $("value_func");
    current_value_label = $("current_value");
    dealer_value_func_label = $("dealer_value_func")
    dealer_current_value_label = $("dealer_current_value");
    settings = $("settings");
    settings_button = $("settings-btn");
    popup = $("popup");
    surr_yes = $("surr_yes");
    surr_no = $("surr_no");
    mute = $("mute")
    music_range = $("music");
    sfx_range = $("sfx");
    deck = $("deck");

    bet_buttons = document.querySelectorAll('.bets button');

    music_range.addEventListener("input", set_volume);
    sfx_range.addEventListener("input", set_volume);
    set_volume()
    mute.checked = false;
    bet_label.innerHTML = "Current bet: $" + final_bet;
    update_balance()
    warning_label.innerHTML = "";
    settings_are_open = false;
    music_range.value = 30;
    sfx_range.value = 30;


    disable(hit_button)
    disable(stand_button)
    disable(double_button)
    // disable(split_button)
    disable(surrender_button)
}
function start()
{
    enable(hit_button)
    enable(stand_button)
    enable(surrender_button)
    disable_fully(start_button)
    bet_buttons.forEach(button => {
        disable(button)
    })
    if ((final_bet*2)<balance) enable(double_button);
    start_button.hidden = true;
    doubled = false;

    previous_hit = []

    outcome_label.innerHTML = "";
    game_ended = false;
    turn = 1;

    document.getElementById("hand").innerHTML = "";
    document.getElementById("dealer_hand").innerHTML = "";

    hit1 = document.createElement("img")
    hit1.src = random_card()
    hit1.alt = "doesnt work";
    document.getElementById("hand").appendChild(hit1);
    previous_hit.push(get_card_filename(hit1.src));

    hit2 = document.createElement("img")
    hit2.src = card_check()
    document.getElementById("hand").appendChild(hit2);

    random_hit = get_card_value(hit1.src) + get_card_value(hit2.src)
    current_value_label.innerHTML = random_hit

    dealer_hit1 = document.createElement("img")
    dealer_hit1.src = card_check()
    document.getElementById("dealer_hand").appendChild(dealer_hit1);

    dealer_hit2 = document.createElement("img")
    dealer_hit2.src = card_check()

    card_back = document.createElement("img")
    card_back.src = "card_back.png"
    document.getElementById("dealer_hand").appendChild(card_back);

    dealer_random_hit = get_card_value(dealer_hit1.src) + get_card_value(dealer_hit2.src);
    dealer_current_value = dealer_random_hit;
    dealer_current_value_label.innerHTML = "?"

    if (get_card_value(hit1.src) === get_card_value(hit2.src)) /*enable(split_button)*/;

}
function get_card_value(src) {
    const number = parseInt(get_card_filename(src));

    if (number >= 10) return 10;
    return number;
}
function get_card_filename(src) {
    return src.split("/").pop();
}
function addBet(bet_amount)
{
    final_bet += bet_amount;
    if (final_bet < balance) {
        bet_label.innerHTML = "Current bet: $" + final_bet;
        warning_label.innerHTML = ""
    }
    else {
        warning_label.innerHTML = "⚠ Can't go higher than your current balance ⚠";
        setTimeout(reset_warning, 3000)
        final_bet -= bet_amount
    }
}
function clear_bet()
{
    final_bet = 1;
    bet_label.innerHTML = "Current bet: $" + final_bet;
}
function set_volume()
{
    let music_vol = music_range.value/100
    let sfx_vol = sfx_range.value/100

    Object.values(music).forEach(audio => audio.volume = music_vol <= 0.05 ? 0 : music_vol);
    Object.values(sfx).forEach(audio => audio.volume = sfx_vol <= 0.05 ? 0 : sfx_vol);
}
function play(audio) {
    audio.currentTime = 0;
    audio.play().catch(err => console.warn("Audio failed:", err));
}
function disable(element)
{
    element.disabled = true
    element.style.opacity = 0.4
    element.style.cursor = "default";
}
function disable_fully(element)
{
    element.disabled = true
    element.style.opacity = 0
    element.style.cursor = "default";
}
function enable(element)
{
    element.disabled = false
    element.style.opacity = 1
    element.style.cursor = "pointer";

}
function random_card()
{
    let max = 13;
    let min = 1;
    let card_value = Math.floor(Math.random() * (max - min + 1) + min);
    let card_suit = suit[Math.floor(Math.random() * 4)];
    return `${card_suit}/${card_value}${card_suit}.png`;
}
function update_balance()
{
    money_label.innerHTML = "Balance: " + "$" + balance;
}
function bust_check()
{
    if(parseInt(current_value_label.innerHTML) > 21) {
        end_game_disable()
        outcome_label.innerHTML = "You lost";
        balance -= final_bet;
        update_balance()
        game_ended = true;

        if (doubled) final_bet /= 2;
        bet_label.innerHTML = "Current bet: $" + final_bet;
        bet_check()
        end_game_disable()
        card_back.src = dealer_hit2.src;
        dealer_current_value_label.innerHTML = dealer_current_value;
    }

}
function bet_check(){
    if (final_bet > balance){
        final_bet = (balance - 1);
        bet_label.innerHTML = "Current bet: $" + final_bet;
    }
    if (balance === 1) {
        balance = 10;
        final_bet = (balance - 1);
        bet_label.innerHTML = "Current bet: $" + final_bet;
        money_label.innerHTML = "Balance: " + "$" + balance;
    }
}
function card_check()
{
    let card;
    let out_of_cards = false;
    let count = 1;
    do {
        card = random_card()
        count++;
        if(count === 55)
        {
            out_of_cards = true;
            break;
        }
    }while (previous_hit.includes(get_card_filename(card)))
    if (out_of_cards)
    {
        warning_label.innerHTML = "⚠ No more cards left ⚠"
        disable(hit_button)
    }
    else
    {
        previous_hit.push(card)
        return card;
    }
}
function end_game_disable()
{
    disable(hit_button)
    disable(stand_button)
    disable(double_button)
    // disable(split_button)
    disable(surrender_button)
    enable(start_button)
    bet_buttons.forEach(button => {
        enable(button)
    })
    start_button.hidden = false
}
function hit_me() {
    turn++;
    if (animating) return;
    play(sfx.hit)
    let new_card;
    new_card = document.createElement("img")
    new_card.src = card_check()
    if (new_card.src === undefined) return;
    document.getElementById("hand").appendChild(new_card);
    card_anim(new_card, null)
    random_hit += get_card_value(new_card.src)
    dealer_current_value = dealer_random_hit;
    current_value_label.innerHTML = random_hit;

    if (turn >= 2) {
        disable(double_button)
        disable(surrender_button)
        // disable(split_button)
    }
    bust_check()
}
function card_anim(card, onDone)
{
    animating = true;
    disable(hit_button)
    disable(stand_button)
    disable(double_button)
    // disable(split_button)
    disable(surrender_button)

    let from = deck.getBoundingClientRect();
    let to = card.getBoundingClientRect();

    let clone = card.cloneNode(true);

    card.style.opacity = 0;

    clone.style.position = "fixed";
    clone.style.top = from.top + "px";
    clone.style.left = from.left + "px";
    clone.style.width = from.width + "px";
    clone.style.height = from.height + "px";
    clone.style.margin = 0;
    clone.style.transform = "none";

    document.body.appendChild(clone);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            clone.style.transition = "left 0.5s ease, top 0.5s ease";
            clone.style.left = to.left + "px";
            clone.style.top = to.top + "px";
        })
    })
    clone.addEventListener("transitionend", () => {
        clone.remove();
        card.style.opacity = 1;
        animating = false;
        if (!game_ended) {
            enable(hit_button)
            enable(stand_button)
        }
        if (onDone) onDone();
    })
}
function dealer_turn()
{
    card_back.src = dealer_hit2.src;

    if (dealer_random_hit < 17 && !game_ended) {
        let new_card = document.createElement("img");
        new_card.src = card_check();
        document.getElementById("dealer_hand").appendChild(new_card);

        dealer_random_hit += get_card_value(new_card.src);
        dealer_current_value = dealer_random_hit;

        card_anim(new_card, () => {
            dealer_turn();
        });

    } else {
        if (!game_ended) resolve_game();
    }
}
function resolve_game()
{
    let player = parseInt(current_value_label.innerHTML);
    let dealer = dealer_current_value;

    if (player > 21) {
        outcome_label.innerHTML = "You lost";
        balance -= final_bet;
    } else if (dealer > 21) {
        outcome_label.innerHTML = "You won";
        balance += final_bet;
    } else if (player > dealer) {
        outcome_label.innerHTML = "You won";
        balance += final_bet;
    } else if (player < dealer) {
        outcome_label.innerHTML = "You lost";
        balance -= final_bet;
    } else {
        outcome_label.innerHTML = "It's a draw";
    }

    game_ended = true;
    update_balance();

    if (doubled) final_bet /= 2;
    bet_label.innerHTML = "Current bet: $" + final_bet;
    dealer_current_value_label.innerHTML = dealer_current_value;
    bet_check();
    end_game_disable();
}
function im_gonna_stay()
{
    disable(hit_button)
    disable(stand_button)
    disable(double_button)
    // disable(split_button)
    disable(surrender_button)

    dealer_turn();
}
function surrender()
{
    popup.style.display = "flex"
}
function im_done()
{
    if (doubled) final_bet /= 2;
    end_game_disable()
    outcome_label.innerHTML = "You lost";
    balance -= Math.ceil(final_bet/2);
    update_balance()
    popup.style.display = "none"
}
function ill_keep_going()
{
    popup.style.display = "none"
}
function split()
{

}
function double()
{
    doubled = true;
    final_bet *= 2;
    hit_me()
    disable(hit_button)
    bet_label.innerHTML = "Current bet: $" + final_bet;
}
function reset_warning()
{
    warning_label.innerHTML = ""
}
function show_settings()
{
    if (settings_are_open === false)
    {
        settings.style.display = "block";
        settings_are_open = true;
        settings_button.classList.add("settings_active");
    }
    else
    {
        settings.style.display = "none";
        settings_are_open = false;
        settings_button.classList.remove("settings_active");
    }
}
function mute_set()
{
    if (mute.checked) {
        prev_music_vol = music_range.value;
        prev_sfx_vol = sfx_range.value;
        disable(music_range)
        disable(sfx_range)
        music_range.value = 0;
        sfx_range.value = 0;

    } else {
        enable(music_range);
        enable(sfx_range);
        music_range.value = prev_music_vol;
        sfx_range.value = prev_sfx_vol;
    }
    set_volume()
}
function save()
{

}