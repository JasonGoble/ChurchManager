import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Organization, OrganizationLevel, OrganizationTree } from '../../core/models/organization.models';
import { OrganizationService } from '../../core/services/organization.service';
import { OrganizationFormDialogComponent } from './organization-form.dialog';
import { OrganizationSettingsDialogComponent } from './organization-settings.dialog';

const LEVEL_COLORS: Record<number, string> = {
  1: '#e3f2fd',
  2: '#f3e5f5',
  3: '#e8f5e9',
  4: '#fff8e1',
  5: '#fce4ec',
};

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [
    CommonModule, MatTreeModule, MatTableModule,
    MatButtonModule, MatButtonToggleModule, MatIconModule, MatChipsModule,
    MatTooltipModule, MatProgressSpinnerModule, MatDialogModule, MatCardModule,
    MatInputModule, MatFormFieldModule,
  ],
  template: `
    <div class="page-header">
      <h1>Organizations</h1>
      <div class="header-actions">
        <mat-button-toggle-group [value]="viewMode()" (change)="viewMode.set($event.value)"
          style="margin-right:16px">
          <mat-button-toggle value="tree">
            <mat-icon>account_tree</mat-icon> Tree
          </mat-button-toggle>
          <mat-button-toggle value="list">
            <mat-icon>view_list</mat-icon> List
          </mat-button-toggle>
        </mat-button-toggle-group>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon> Add Organization
        </button>
      </div>
    </div>

    @if (loading()) {
      <div class="spinner-center">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    }

    <!-- ── Tree View ─────────────────────────────────────────── -->
    @if (!loading() && viewMode() === 'tree') {
      @if (treeData().length === 0) {
        <mat-card class="empty-card">
          <mat-icon>corporate_fare</mat-icon>
          <p>No organizations yet. Add your first one.</p>
        </mat-card>
      } @else {
        <mat-card>
          <mat-tree [dataSource]="treeData()" [childrenAccessor]="childrenAccessor" class="org-tree">
            <!-- Leaf node -->
            <mat-tree-node *matTreeNodeDef="let node">
              <div class="tree-row" [style.paddingLeft.px]="levelIndent(node.level)">
                <button mat-icon-button disabled style="visibility:hidden"></button>
                <mat-icon class="org-icon">{{ levelIcon(node.level) }}</mat-icon>
                <span class="org-name">{{ node.name }}</span>
                <span class="level-badge" [style.background]="levelColor(node.level)">
                  {{ levelName(node.level) }}
                </span>
                @if (!node.isActive) { <span class="inactive-badge">Inactive</span> }
                <span class="tree-spacer"></span>
                <button mat-icon-button matTooltip="Edit" (click)="openEditDialog(node.id)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Settings" (click)="openSettingsDialog(node.id)">
                  <mat-icon>settings</mat-icon>
                </button>
              </div>
            </mat-tree-node>

            <!-- Parent node -->
            <mat-tree-node *matTreeNodeDef="let node; when: hasChild" #parentNode="matTreeNode">
              <div class="tree-node-wrapper">
                <div class="tree-row parent-row" [style.paddingLeft.px]="levelIndent(node.level)">
                  <button mat-icon-button matTreeNodeToggle>
                    <mat-icon>{{ parentNode.isExpanded ? 'expand_more' : 'chevron_right' }}</mat-icon>
                  </button>
                  <mat-icon class="org-icon">{{ levelIcon(node.level) }}</mat-icon>
                  <span class="org-name">{{ node.name }}</span>
                  <span class="level-badge" [style.background]="levelColor(node.level)">
                    {{ levelName(node.level) }}
                  </span>
                  @if (!node.isActive) { <span class="inactive-badge">Inactive</span> }
                  <span class="tree-spacer"></span>
                  <button mat-icon-button matTooltip="Add child" (click)="openCreateDialog(node)">
                    <mat-icon>add</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Edit" (click)="openEditDialog(node.id)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Settings" (click)="openSettingsDialog(node.id)">
                    <mat-icon>settings</mat-icon>
                  </button>
                </div>
                <div [class.tree-hidden]="!parentNode.isExpanded" role="group" class="child-group"
                     [style.marginLeft.px]="levelIndent(node.level) + 20">
                  <ng-container matTreeNodeOutlet></ng-container>
                </div>
              </div>
            </mat-tree-node>
          </mat-tree>
        </mat-card>
      }
    }

    <!-- ── List View ─────────────────────────────────────────── -->
    @if (!loading() && viewMode() === 'list') {
      <div class="filter-bar">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [value]="searchText()"
            (input)="searchText.set($any($event.target).value)"
            placeholder="Name, city…">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      @if (isMobile()) {
        <!-- Mobile card list -->
        @if (filteredOrgs().length === 0) {
          <mat-card class="empty-card">
            <mat-icon>corporate_fare</mat-icon>
            <p>{{ searchText() ? 'No organizations match "' + searchText() + '"' : 'No organizations yet.' }}</p>
          </mat-card>
        } @else {
          <div class="mobile-card-list">
            @for (o of filteredOrgs(); track o.id) {
              <div class="org-mobile-card">
                <div class="org-card-main">
                  <span class="org-card-name">{{ o.name }}</span>
                  <span class="level-badge" [style.background]="levelColor(o.level)">{{ levelName(o.level) }}</span>
                </div>
                @if (o.parentName) {
                  <div class="org-card-secondary">Under {{ o.parentName }}</div>
                }
                @if (o.city || o.state || o.country) {
                  <div class="org-card-secondary">{{ [o.city, o.state, o.country].filter(v => !!v).join(', ') }}</div>
                }
                <div class="org-card-footer">
                  <span class="status-chip" [class.active]="o.isActive" [class.inactive]="!o.isActive">
                    {{ o.isActive ? 'Active' : 'Inactive' }}
                  </span>
                  <div class="org-card-actions">
                    <button mat-icon-button matTooltip="Edit" (click)="openEditDialog(o.id)"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button matTooltip="Settings" (click)="openSettingsDialog(o.id)"><mat-icon>settings</mat-icon></button>
                    <button mat-icon-button matTooltip="Add child" (click)="openCreateDialogForParent(o)"><mat-icon>add_business</mat-icon></button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      } @else {
        <!-- Desktop table -->
        <mat-card>
          <table mat-table [dataSource]="filteredOrgs()" class="mat-elevation-z0 full-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let o"><strong>{{ o.name }}</strong></td>
            </ng-container>
            <ng-container matColumnDef="level">
              <th mat-header-cell *matHeaderCellDef>Level</th>
              <td mat-cell *matCellDef="let o">
                <span class="level-badge" [style.background]="levelColor(o.level)">{{ levelName(o.level) }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="parent">
              <th mat-header-cell *matHeaderCellDef>Parent</th>
              <td mat-cell *matCellDef="let o">{{ o.parentName ?? '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Location</th>
              <td mat-cell *matCellDef="let o">{{ [o.city, o.state, o.country].filter(v => !!v).join(', ') || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="members">
              <th mat-header-cell *matHeaderCellDef>Members</th>
              <td mat-cell *matCellDef="let o">{{ o.memberCount }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let o">
                <span class="status-chip" [class.active]="o.isActive" [class.inactive]="!o.isActive">
                  {{ o.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let o" style="white-space:nowrap">
                <button mat-icon-button matTooltip="Edit" (click)="openEditDialog(o.id)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button matTooltip="Settings" (click)="openSettingsDialog(o.id)"><mat-icon>settings</mat-icon></button>
                <button mat-icon-button matTooltip="Add child" (click)="openCreateDialogForParent(o)"><mat-icon>add_business</mat-icon></button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            @if (filteredOrgs().length === 0) {
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
                  {{ searchText() ? 'No organizations match "' + searchText() + '"' : 'No organizations yet. Add your first one.' }}
                </td>
              </tr>
            }
          </table>
        </mat-card>
      }
    }
  `,
  styles: [`
    .page-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
    }
    .page-header h1 { margin: 0; font-size: 24px; font-weight: 400; color: #333; }
    .header-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    @media (max-width: 767px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .header-actions mat-button-toggle-group { overflow-x: auto; max-width: 100%; }
    }

    /* Mobile card list */
    .mobile-card-list { display: flex; flex-direction: column; gap: 8px; }
    .org-mobile-card {
      background: #fff; border-radius: 8px; padding: 14px 16px;
      box-shadow: 0 1px 4px rgba(31,42,68,0.07);
      display: flex; flex-direction: column; gap: 6px;
    }
    .org-card-main { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .org-card-name { font-weight: 500; font-size: 15px; color: #1F2A44; }
    .org-card-secondary { font-size: 13px; color: #5E6B7A; }
    .org-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; }
    .org-card-actions { display: flex; }
    .spinner-center { display: flex; justify-content: center; padding: 64px; }
    .empty-card {
      display: flex; flex-direction: column; align-items: center;
      padding: 48px; color: #aaa; gap: 12px;
    }
    .empty-card mat-icon { font-size: 48px; width: 48px; height: 48px; }

    /* Tree */
    .org-tree { background: transparent; width: 100%; }
    .tree-node-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .tree-row {
      display: flex; align-items: center; flex: 1; min-width: 0; min-height: 48px;
      padding-top: 4px; padding-right: 8px; padding-bottom: 4px;
      border-bottom: 1px solid #f5f5f5;
    }
    .tree-row:hover { background: #fafafa; }
    .parent-row { font-weight: 500; }
    .child-group { border-left: 2px solid #e0e0e0; padding-bottom: 2px; }
    .tree-hidden { display: none; }
    .tree-spacer { flex: 1; }
    .org-icon { color: #888; margin-right: 8px; font-size: 20px; width: 20px; height: 20px; }
    .org-name { font-size: 14px; margin-right: 8px; }

    .level-badge {
      font-size: 11px; padding: 2px 8px; border-radius: 10px;
      font-weight: 500; margin-right: 6px;
    }
    .inactive-badge {
      font-size: 11px; padding: 2px 8px; border-radius: 10px;
      background: #f5f5f5; color: #999; font-weight: 500;
    }

    /* List */
    .filter-bar { margin-bottom: 16px; }
    .full-table { width: 100%; }
    .no-data { padding: 24px; text-align: center; color: #aaa; }
    .status-chip {
      padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;
    }
    .status-chip.active   { background: #e8f5e9; color: #2e7d32; }
    .status-chip.inactive { background: #fafafa; color: #757575; }
  `],
})
export class OrganizationsComponent implements OnInit {
  private orgService = inject(OrganizationService);
  private dialog = inject(MatDialog);
  private bp = inject(BreakpointObserver);

  isMobile = toSignal(
    this.bp.observe('(max-width: 767px)').pipe(map(r => r.matches)),
    { initialValue: false }
  );

  viewMode = signal<'tree' | 'list'>('tree');
  loading = signal(false);
  searchText = signal('');

  private organizations = signal<Organization[]>([]);
  private levels = signal<OrganizationLevel[]>([]);

  filteredOrgs = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    const orgs = this.organizations();
    if (!q) return orgs;
    return orgs.filter(o =>
      o.name.toLowerCase().includes(q) ||
      (o.parentName ?? '').toLowerCase().includes(q) ||
      (o.city ?? '').toLowerCase().includes(q) ||
      (o.state ?? '').toLowerCase().includes(q) ||
      (o.country ?? '').toLowerCase().includes(q)
    );
  });

  // Tree
  @ViewChild(MatTree) private tree!: MatTree<OrganizationTree>;
  treeData = signal<OrganizationTree[]>([]);
  childrenAccessor = (node: OrganizationTree) => node.children ?? [];
  hasChild = (_: number, n: OrganizationTree) => !!n.children?.length;

  displayedColumns = ['name', 'level', 'parent', 'location', 'members', 'status', 'actions'];

  ngOnInit() { this.loadData(); }

  private async loadData() {
    this.loading.set(true);
    try {
      const [orgs, tree, levels] = await Promise.all([
        firstValueFrom(this.orgService.getAll()),
        firstValueFrom(this.orgService.getTree()),
        firstValueFrom(this.orgService.getLevels()),
      ]);
      this.organizations.set(orgs);
      this.levels.set(levels);
      this.treeData.set(tree);
      Promise.resolve().then(() => this.tree?.expandAll());
    } finally {
      this.loading.set(false);
    }
  }

  levelIndent(level: number): number {
    return (level - 1) * (this.isMobile() ? 16 : 32);
  }

  levelName(level: number): string {
    return this.levels().find(l => l.level === level)?.displayName ?? `Level ${level}`;
  }

  levelColor(level: number): string {
    return LEVEL_COLORS[level] ?? '#f5f5f5';
  }

  levelIcon(level: number): string {
    const icons: Record<number, string> = { 1: 'hub', 2: 'location_city', 3: 'church' };
    return icons[level] ?? 'corporate_fare';
  }

  openCreateDialog(parentNode?: OrganizationTree) {
    const ref = this.dialog.open(OrganizationFormDialogComponent, {
      width: '620px', maxWidth: '95vw',
      data: {
        organization: parentNode
          ? { parentOrganizationId: parentNode.id, level: parentNode.level + 1 }
          : undefined,
        levels: this.levels(),
        parentOrganizations: this.organizations(),
      },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  openCreateDialogForParent(org: Organization) {
    const ref = this.dialog.open(OrganizationFormDialogComponent, {
      width: '620px', maxWidth: '95vw',
      data: {
        organization: { parentOrganizationId: org.id, level: org.level + 1 },
        levels: this.levels(),
        parentOrganizations: this.organizations(),
      },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  openEditDialog(id: number) {
    const org = this.organizations().find(o => o.id === id);
    if (!org) return;
    const ref = this.dialog.open(OrganizationFormDialogComponent, {
      width: '620px', maxWidth: '95vw',
      data: { organization: org, levels: this.levels(), parentOrganizations: this.organizations() },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  openSettingsDialog(id: number) {
    const org = this.organizations().find(o => o.id === id);
    const ref = this.dialog.open(OrganizationSettingsDialogComponent, {
      width: '580px', maxWidth: '95vw',
      data: { organizationId: id, orgName: org?.name ?? '' },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }
}
