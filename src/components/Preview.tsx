import { type FC, memo } from "react";
import styled from "styled-components";
import { COLORS, SPACING, TYPOGRAPHY } from "../constants/uiConfig";
import type { Preview as PreviewType } from "../types/editor";

// ============================================================================
// Styled Components
// ============================================================================

const PreviewContainer = styled.div`
  padding: ${SPACING.lg};
  background-color: ${COLORS.background.lighter};
  border-top: 1px solid ${COLORS.border.light};
  max-height: 300px;
  overflow-y: auto;
`;

const PreviewTitle = styled.h3`
  margin: 0 0 ${SPACING.md} 0;
  font-size: ${TYPOGRAPHY.fontSize.md};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  color: ${COLORS.text.primary};
`;

const EmbedContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 アスペクト比 */
  height: 0;
  overflow: hidden;
  border-radius: 4px;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const IframeContainer = styled.div`
  border: 1px solid ${COLORS.border.light};
  border-radius: 4px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 400px;
    border: none;
  }
`;

const LinkContainer = styled.div`
  padding: ${SPACING.md};
  background-color: #f5f5f5;
  border: 1px solid ${COLORS.border.light};
  border-radius: 4px;
`;

const LinkText = styled.p`
  margin: 0 0 ${SPACING.sm} 0;
  color: ${COLORS.text.primary};
  font-size: ${TYPOGRAPHY.fontSize.sm};
`;

const LinkAnchor = styled.a`
  color: ${COLORS.primary};
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

const NoPreviewMessage = styled.p`
  color: ${COLORS.text.secondary};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  margin: 0;
`;

// ============================================================================
// Sub-components
// ============================================================================

interface EmbedPreviewProps {
  src: string;
}

const EmbedPreview: FC<EmbedPreviewProps> = memo(({ src }) => (
  <EmbedContainer>
    <iframe
      src={src}
      title="embed-preview"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  </EmbedContainer>
));

EmbedPreview.displayName = "EmbedPreview";

interface IframePreviewProps {
  src: string;
}

const IframePreview: FC<IframePreviewProps> = memo(({ src }) => (
  <IframeContainer>
    <iframe src={src} title="iframe-preview" sandbox="allow-same-origin" />
  </IframeContainer>
));

IframePreview.displayName = "IframePreview";

interface LinkPreviewProps {
  src: string;
}

const LinkPreview: FC<LinkPreviewProps> = memo(({ src }) => (
  <LinkContainer>
    <LinkText>감지된 URL: {src}</LinkText>
    <LinkText>
      이 URL은 자동 미리보기를 생성할 수 없습니다. 새 탭에서 열기:
    </LinkText>
    <LinkAnchor href={src} target="_blank" rel="noopener noreferrer">
      {src}
    </LinkAnchor>
  </LinkContainer>
));

LinkPreview.displayName = "LinkPreview";

// ============================================================================
// Main Component
// ============================================================================

interface PreviewComponentProps {
  preview: PreviewType | null;
  lastDetectedUrl: string | null;
}

const PreviewComponent: FC<PreviewComponentProps> = memo(
  ({ preview, lastDetectedUrl }) => {
    if (!preview && !lastDetectedUrl) {
      return null;
    }

    return (
      <PreviewContainer>
        <PreviewTitle>미리보기</PreviewTitle>

        {preview ? (
          preview.type === "embed" ? (
            <EmbedPreview src={preview.src} />
          ) : preview.type === "iframe" ? (
            <IframePreview src={preview.src} />
          ) : (
            <LinkPreview src={preview.src} />
          )
        ) : (
          <NoPreviewMessage>미리보기 처리 중...</NoPreviewMessage>
        )}
      </PreviewContainer>
    );
  },
);

PreviewComponent.displayName = "PreviewComponent";

export default PreviewComponent;
