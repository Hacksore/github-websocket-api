## get runs from repo
https://api.github.com/repos/Hacksore/test/actions/runs



## Print out all the dom nodes with subs
```js
console.log(
  Array.from(document.querySelectorAll(".js-socket-channel[data-channel]")).map(
    (item) => ({
      id: item.attributes["data-channel"].textContent,
      url: item.attributes["data-url"] && item.attributes["data-url"].textContent
    })
  )
);

```
