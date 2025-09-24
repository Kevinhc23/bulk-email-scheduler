export interface JobQueue {
  add(
    name: string,
    data: Record<string, any>,
    opts?: Record<string, any>,
  ): Promise<void>;

  addBulk(
    jobs: {
      name: string;
      data: Record<string, any>;
      opts?: Record<string, any>;
    }[],
  ): Promise<void>;
}
