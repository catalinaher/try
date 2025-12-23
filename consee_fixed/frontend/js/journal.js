const form = document.getElementById("journalForm");
const diary = document.getElementById("diary");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const concert = document.getElementById("concert").value;
  const artist = document.getElementById("artist").value;
  const dateVal = document.getElementById("date").value;
  const rating = document.getElementById("rating").value;
  const notes = document.getElementById("notes").value;
  const file = document.getElementById("media").files[0];

  const date = new Date(dateVal);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  const entry = document.createElement("div");
  entry.className = "diary-entry";

  entry.innerHTML = `
    <div class="diary-date">
      <strong>${day}</strong>${month}
    </div>
    <div class="diary-content">
      <h3>${concert}</h3>
      <div class="meta">${artist}</div>
      ${rating ? `<div class="stars">${"★".repeat(rating)}</div>` : ""}
      <div class="text">${notes}</div>
    </div>
  `;

  if (file) {
    const url = URL.createObjectURL(file);
    let media;

    if (file.type.startsWith("video")) {
      media = document.createElement("video");
      media.src = url;
      media.controls = true;
    } else {
      media = document.createElement("img");
      media.src = url;
    }

    media.className = "diary-media";
    entry.querySelector(".diary-content").appendChild(media);
  }

  diary.prepend(entry);
  form.reset();
});


