import { type FC, memo } from "react";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

/**
 * 자동 링크 감지 플러그인
 * Lexical에서 제공하는 LinkPlugin을 래핑합니다.
 */
const AutoLinkPlugin: FC = memo(() => {
  return <LinkPlugin />;
});

AutoLinkPlugin.displayName = "AutoLinkPlugin";

export default AutoLinkPlugin;
