export default (html, scope) => html`

<div>
  ${{ html: scope.slides }}
</div>

<nav>
  <ul class="cd-vertical-nav">
    <li>
      <a href="#0" class="cd-prev inactive">Next</a>
    </li>
    <li>
      <a href="#0" class="cd-next">Prev</a>
    </li>
  </ul>
</nav>
`;