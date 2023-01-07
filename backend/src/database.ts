import { Database } from "bun:sqlite";
import { IAction } from "./lib/action";

export class MotionDetectorDatabase extends Database {
  constructor() {
    super("motiondetector.sqlite");
  }

  public init() {
    this.run(
      "CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT, date INTEGER, origin TEXT)"
    );
    this.run(
      "CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, sleepFrom INTEGER, sleepTo INTEGER)"
    );
    this.run(
      "CREATE TABLE IF NOT EXISTS actions (id INTEGER PRIMARY KEY AUTOINCREMENT, active INTEGER, name TEXT, type TEXT, settings TEXT)"
    );
    const settings = this.query("SELECT * FROM settings").all();
    if (Array.isArray(settings) && settings.length === 0) {
      const defaultSleepFrom = new Date().setHours(0, 0);
      const defaultSleepTo = new Date().setHours(6, 0);
      this.run(
        "INSERT INTO settings(sleepFrom, sleepTo) VALUES(?, ?)",
        defaultSleepFrom.valueOf(),
        defaultSleepTo.valueOf()
      );
    }
  }

  public addActivity(eventType: string, origin: string): void {
    const date = new Date().valueOf();
    this.run(
      "INSERT INTO activities (event, date, origin) VALUES (?, ?, ?)",
      eventType,
      date.toString(),
      origin
    );
  }

  public getActivities(): unknown[] {
    return this.query("SELECT * FROM activities").all();
  }

  public getSettings(): unknown {
    return this.query("SELECT * FROM settings").get();
  }

  public saveSettings({
    sleepFrom,
    sleepTo,
  }: {
    sleepFrom: number;
    sleepTo: number;
  }): void {
    this.run(
      "UPDATE settings SET sleepFrom = ?, sleepTo = ?",
      sleepFrom,
      sleepTo
    );
  }

  public deleteAppData(): void {
    this.run("DROP TABLE activities");
    this.run("DROP TABLE settings");
    this.run("DROP TABLE actions");
    this.init();
  }

  public getActions(): IAction[] {
    const actions = this.query("SELECT * FROM actions").all();

    actions.forEach((action) => {
      action.active = action.active === 1 ? true : false;
      action.settings = JSON.parse(action.settings);
    });
    return actions;
  }

  public deleteAction(id: string): unknown {
    return this.run("DELETE FROM actions WHERE id = ?", id);
  }

  public saveAction(action: IAction): void {
    const dbAction = [
      (action.active ? 1 : 0) as unknown as string, // WTF bun?!
      action.name,
      action.type,
      JSON.stringify(action.settings),
    ];
    if (action.id) {
      dbAction.push(action.id.toString());
      this.run<string>(
        "UPDATE actions SET active = ?, name = ?, type = ?, settings = ? WHERE id = ?",
        ...dbAction
      );
    } else {
      this.run<string>(
        "INSERT INTO actions (active, name, type, settings) VALUES (?, ?, ?, ?)",
        ...dbAction
      );
    }
  }
}
