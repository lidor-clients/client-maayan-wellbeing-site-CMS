import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { SiteContent } from "../types/content";
import { useAuth } from "./AuthContext";

type SectionKey = keyof SiteContent;

type ContentContextType = {
  content: SiteContent | null;
  loading: boolean;
  updateSection: <K extends SectionKey>(section: K, data: SiteContent[K]) => Promise<void>;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuth();

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data: SiteContent) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load content:", err);
        setLoading(false);
      });
  }, []);

  const updateSection = useCallback(
    async <K extends SectionKey>(section: K, data: SiteContent[K]) => {
      // optimistic update
      setContent((prev) => (prev ? { ...prev, [section]: data } : prev));

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        await fetch(`/api/content/${String(section)}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.error("Failed to save content:", err);
      }
    },
    [token]
  );

  return (
    <ContentContext.Provider value={{ content, loading, updateSection }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
